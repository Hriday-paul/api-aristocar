"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_constants_1 = require("./user.constants");
const node_cron_1 = __importDefault(require("node-cron"));
const userSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active',
    },
    name: {
        type: String,
        // required: true,
        default: null,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Others'],
        default: null,
    },
    dateOfBirth: {
        type: String,
        default: null,
    },
    isGoogleLogin: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        enum: user_constants_1.Role,
        default: user_constants_1.USER_ROLE.user,
    },
    companyName: {
        type: String,
        default: null,
    },
    dealership: {
        type: String,
        default: null,
    },
    user_address: {
        type: String,
        default: null,
    },
    dealer_address: {
        city: {
            type: String,
            default: null,
        },
        country: {
            type: String,
            default: null,
        },
        post_code: {
            type: String,
            default: null,
        },
        vat_id: {
            type: String,
            default: null,
        },
        street: {
            type: String,
            default: null,
        },
    },
    vat_status: {
        type: String,
        enum: ['valid', 'vat not valid'],
        default: 'valid',
    },
    vat_type: {
        type: String,
        default: null,
    },
    needsPasswordChange: {
        type: Boolean,
    },
    passwordChangedAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    verification: {
        otp: {
            type: mongoose_1.Schema.Types.Mixed,
            default: 0,
        },
        expiresAt: {
            type: Date,
        },
        status: {
            type: Boolean,
            default: false,
        },
    },
    freeExpairDate: {
        type: Date,
    },
    freeLimit: {
        type: Number,
    },
    carCreateLimit: {
        type: Number,
    },
    durationDay: {
        type: Number,
    },
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        // Hash password if not using Google Login
        if (!user.isGoogleLogin) {
            user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        }
        next();
    });
});
// set '' after saving password
userSchema.post('save', 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function (error, doc, next) {
    doc.password = '';
    next();
});
userSchema.statics.isUserExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email: email }).select('+password');
    });
};
userSchema.statics.IsUserExistId = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findById(id).select('+password');
    });
};
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
exports.User = (0, mongoose_1.model)('User', userSchema);
// Daily Cron Job to decrement durationDay
node_cron_1.default.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Running daily job to decrement durationDay...');
    try {
        const users = yield exports.User.find({ durationDay: { $gt: 0 } });
        for (const user of users) {
            user.durationDay -= 1; // Decrement durationDay
            if (user.durationDay === 0) {
                user.carCreateLimit = 0; // Reset carCreateLimit if durationDay expires
            }
            yield user.save(); // Save the updated user
        }
        console.log('Daily job completed successfully.');
    }
    catch (error) {
        console.error('Error running daily job:', error);
    }
}));
