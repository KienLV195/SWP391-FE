# Test Accounts for Blood Donation Management System

## Password Requirements
All passwords must meet the following criteria:
- **Minimum 6 characters**
- **At least one lowercase letter** (a-z)
- **At least one uppercase letter** (A-Z)
- **At least one number** (0-9)
- **At least one special character** (!@#$%^&*(),.?":{}|<>)

## Test Accounts

### Members (Blood Donors/Recipients)
| Email | Password | Role | Name |
|-------|----------|------|------|
| member1@test.com | Member1@ | MEMBER | Nguyễn Văn A |
| member2@test.com | Member2@ | MEMBER | Trần Thị B |
| member3@test.com | Member3@ | MEMBER | Lê Văn C |
| member4@test.com | Member4@ | MEMBER | Phạm Thị D |
| member5@test.com | Member5@ | MEMBER | Hoàng Văn E |

### Doctors
| Email | Password | Role | Name | Department |
|-------|----------|------|------|------------|
| doctor1@test.com | Doctor1@ | DOCTOR | BS. Nguyễn Văn H | Blood Department |
| doctor2@test.com | Doctor2@ | DOCTOR | BS. Trần Thị I | Blood Department |

### Managers
| Email | Password | Role | Name |
|-------|----------|------|------|
| manager@test.com | Manager1@ | MANAGER | Lê Văn J |

### Administrators
| Email | Password | Role | Name |
|-------|----------|------|------|
| admin@test.com | Admin123@ | ADMIN | Nguyễn Văn Admin |
| superadmin@test.com | SuperAdmin1@ | SUPER_ADMIN | Trần Thị Super Admin |

## Usage Instructions

### For Development/Testing:
1. Use any of the above email/password combinations to login
2. Each role has different access levels and features
3. All passwords meet the new validation requirements

### For Registration Testing:
When testing the registration form, use passwords that meet the requirements:
- ✅ Valid examples: `Password1@`, `MyPass123!`, `SecureP@ss1`
- ❌ Invalid examples: `123456`, `password`, `PASSWORD`, `Pass123`

### Password Validation Examples:

**Valid Passwords:**
- `Member1@` - Has all requirements
- `Doctor1@` - Has all requirements
- `Admin123@` - Has all requirements
- `MySecure1@` - Has all requirements

**Invalid Passwords & Error Messages:**
- `123456` → "Mật khẩu phải bao gồm: một chữ thường (a-z), một chữ hoa (A-Z), một ký tự đặc biệt (!@#$%^&*)"
- `password` → "Mật khẩu phải bao gồm: một chữ hoa (A-Z), một chữ số (0-9), một ký tự đặc biệt (!@#$%^&*)"
- `PASSWORD` → "Mật khẩu phải bao gồm: một chữ thường (a-z), một chữ số (0-9), một ký tự đặc biệt (!@#$%^&*)"
- `Pass123` → "Mật khẩu phải bao gồm: một ký tự đặc biệt (!@#$%^&*)"
- `Pass@` → "Mật khẩu phải bao gồm: tối thiểu 6 ký tự, một chữ số (0-9)"

## API Integration Notes

When integrating with real backend API:
1. All mock passwords are already compliant with validation rules
2. Backend should hash passwords before storage
3. Login API should accept these test credentials during development
4. Password validation should be enforced on both frontend and backend

## Security Notes

⚠️ **Important**: These are test accounts for development only!
- Never use these passwords in production
- Always hash passwords in real applications
- Implement proper password policies in production
- Consider additional security measures (2FA, password expiry, etc.)
