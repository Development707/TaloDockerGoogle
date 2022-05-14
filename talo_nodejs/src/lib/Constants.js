// Khai báo giá trị được: sửa, thêm

const ErrorType = {
    // Auth
    ID_NOT_FOUND: 'ID user',
    NAME_INVALID: 'Tên không hợp lệ',
    USERNAME_NOT_FOUND: 'username',
    USERNAME_INVALID: 'Tài khoản không hợp lệ',
    USERNAME_EXISTS_INVALID: 'Tài khoản đã tồn tại',
    PASSWORD_INVALID: 'Mật khẩu không hợp lệ, từ 8 đến 50 kí tự',
    LOGIN_INVALID: 'Tài khoản hoặc mật khẩu hợp lệ',
    // OTP
    OTP_INVALID: 'OTP không hợp lệ',
    OTP_TIMEOUT: 'OTP đã hết hạn',
    VERIFY_ACCOUNT_INVALID: 'Username hoặc OTP không hợp lệ',
    // Token
    TOKEN_NOT_FOUND: 'Không tìm thấy token ở header',
    TOKEN_INVALID: 'Token không hợp lệ',
    TOKEN_NOT_ACCESSIBLE: 'Token Không được phép truy cập tài nguyên này',
    TOKEN_EXPIRED: 'Token hết hạn ',
    // Profile
    PROFILE_INVALID: 'Profile không hợp lệ',
    DATE_INVALID: 'Ngày không hợp lệ',
    GENDER_INVALID: 'Giới tính không hợp lệ',
    FILE_INVALID: ' file không hợp lệ.',
    AVATAR_INVALID: 'File: Ảnh đại diện không hợp lệ (png,jpeg)',
    CONTACTS_INVALID: 'Contacts: danh sách số điện thoại không hợp lệ',
    PHONE_INVALID: 'Phone: số điện thoạt không hợp lệ',
    INCORRECT_PASSWORD: 'Password: mật khẩu không đúng',
    NEW_PASSWORD_INVALID: 'New password: không hợp lệ, giống current password',
    // Google Cloud
    FILE_NOT_FOUND: 'File',
    FILE_AVATAR_NOT_FOUND: 'File ảnh đại diện xóa không thành công - ',
    FILE_COVER_PHOTO_NOT_FOUND: 'File ảnh bìa xóa không thành công - ',
    FILE_BASE64_INVALID: 'File hình ảnh base64 có thông tin không hợp lệ',
    // Search
    SEARCH_QUERY_INVALID: 'Truy vấn không hợp lệ',
    // Friend
    FRIEND_REQUEST_INVALID: 'Yêu cầu kết bạn không hợp lệ',
    FRIEND_REQUEST_EXIST: 'Đã có yêu cầu kết bạn',
    FRIEND_REQUEST_NOT_FOUND: 'Không tìm thấy lời mời',
    FRIEND_EXIST: 'Đã là bạn bè',
    FRIEND_NOT_FOUND: 'Không tìm thấy bạn',
    FRIEND_SUGGEST_INVALID: 'Yêu cầu gợi ý kết bạn không hợp lệ',
    // Message
    MESSAGE_PARAMETER_INVALID: 'Param không hợp lệ',
    MESSAGE_TYPE_INVALID: 'Kiểu tin nhắn không hợp lệ',
    MESSAGE_TYPE_FILE_INVALID: 'Kiển file không hợp lệ',
    MESSAGE_REACT_INVALID: 'Kiểu react không hợp lệ',
    MESSAGE_PIN_INVALID: 'Tin nhắn ghim không hợp lệ',
    MESSAGE_OPTIONS_INVALID: 'Lựa chọn không hợp lệ >1',
    MESSAGE_CONTENT_MISSING: 'Không tìm thấy nội dung',
    MESSAGE_QUESTION_MISSING: 'Không tìm thấy câu hỏi',
    MESSAGE_NO_TAGS: 'Không tìm thấy tags',
    MESSAGE_IS_DELETED: 'Tin nhắn đã xóa',
    MESSAGE_NOT_FOUND: 'Tin nhắn',
    // Member
    MEMBER_NOT_FOUND: 'Thành viên',
    MEMBER_NOTIFY_INVALID: 'isNotify không phải boolean',
    MEMBER_STATUS_INVALID: 'isStatus không phải boolean',
    // Conversation
    CONVERSATION_NOT_FOUND: 'Cuộc hội thoại',
    CONVERSATION_TYPE_INVALID: 'Param type: không hợp lệ (ALL,DUAL,GROUP)',
    CONVERSATION_USERIDS_INVALID: 'Body userIds: không hợp lệ (>=2 user)',
    CONVERSATION_USERIDS_ADD_INVALID: 'Body userIds: không hợp lệ Array',
    CONVERSATION_DUAL_USERID_INVALID: 'Userid: không hợp lệ',
    CONVERSATION_NOT_GROUP: 'Không phải nhóm hội thoại',
    CONVERSATION_EXIST_MEMBER: 'Bạn đã tham giá nhóm',
    CONVERSATION_EXIST_MANAGER: 'Quản lý nhóm đã tồn tại',
    CONVERSATION_NOT_EXIST_USER: 'User không tồn tại trong nhóm',
    CONVERSATION_NOT_EXIST_MANAGER: 'Quản lý nhóm không tồn tại',
    CONVERSATION_NOT_LEFT_GROUP: 'Bạn không thể rời nhóm',
    CONVERSATION_REMOVED_YOU: 'Bạn không thể xóa bạn khỏi nhóm',
    // Classify
    CLASSIFY_COLOR_INVALID: 'Mã màu không hợp lệ',
    CLASSIFY_NAME_INVALID: 'Tên không hợp lệ',
    CLASSIFY_ID_INVALID: 'Id không hợp lệ',
    CLASSIFY_EXIST: 'Phân loại hội thoại này đã tồn tại',
    CLASSIFY_NOT_EXIST: 'Phân loại hội thoại này không tồn tại',
    CLASSIFY_NOT_FOUND: 'phân loại hội thoại',
    CLASSIFY_CONVERSATION_EXISTS:
        'Phân loại hội thoại đã có trong hội thoại này',
    CLASSIFY_UPDATE_FAILED: 'Phân loại cập nhật không thành công',
    CLASSIFY_DELETE_FAILED: 'Phân loại xóa không thành công',
    // Channel
    CHANNEL_NOT_FOUND: 'Không tìm thấy channel',
    CHANNEL_INVALID: 'Channel không hợp lệ',
    CHANNEL_ID_INVALID: 'Channel id không hợp lệ',
    CHANNEL_NAME_INVALID: 'Channel name không hợp lệ 5-100 ký tự',
    CHANNEL_DESCRIPTION_INVALID: 'Channel name không hợp lệ <100 ký tự',
    CHANNEL_TAG_INVALID: 'Tag không hợp lệ',
    CHANNEL_REPLYMESSAGE_INVALID: 'Replymessage không hợp lệ',
    // Sticker
    STICKER_NOT_FOUND: 'Sticker gán nhãn',
    STICKER_NAME_INVALID: 'Sticker tên phải từ 5-100 ký tự',
    STICKER_DESCRIPTION_INVALID: 'Sticker description phải ít hơn 100 ký tự',
    STICKER_CANNOT_DELETE: 'Sticker không được xóa vì có emoji >0',
    // User
    USER_NOT_UPDATE_ME: 'Không được cập nhật bạn',
    // Report
    REPORT_TILE_INVALID: 'Title báo lỗi không hợp lệ',
    REPORT_USER_INVALID: 'User không hợp lệ',
    REPORT_CONVERSATION_INVALID: 'Hội thoại không hợp lệ',
    REPORT_ID_INVALID: 'ID không hợp lệ',
};

const Permission = {
    USER_PERMISSION_DENIED: 'Từ chối truy cập của bạn',
    CONVERSATION_PERMISSION_DENIED: 'Hội thoại từ chối không cho phép',
    MESSAGE_PERMISSION_DENIED: 'Tin nhắn từ chối không cho phép',
};

const Notification = {
    DATABASE_CONNECT: '[Database] kết nối thành công',
    DATABASE_CONNECT_ERROR: '[Database] kết nối lỗi ',

    REDIS_CONNECT: '[Redis] kết nối thành công',
    REDIS_CONNECT_ERROR: '[Redis] kết nối lỗi',
    REDIS_RETRY: 'Máy chủ đã từ chối kết nối. Đang thử lại kết nối...',
    REDIS_ERROR: '[Redis] lỗi',

    SOCKET_IO_ERROR: '[Socket] lỗi',

    JOIN_WITH_LINK_TO_GROUP: 'Đã vào nhóm từ link',
    LEFT_MEMBER_FROM_GROUP: 'Đã rời khỏi nhóm',

    WE_WERE_FRIEND: 'Đã là bạn bè',
    WE_WERE_GROUP: 'Đã là nhóm',

    ADD_YOU_TO_GROUP: 'Đã thêm vào nhóm',
    ADD_MANAGER_TO_GROUP: 'Đã thêm vào quản lý nhóm',
    MESSAGE_PIN_ADD: 'Đã ghim 1 tin nhắn',
    ADD_CHANNEL: 'Đã tạo 1 channel',

    CHANGE_CHANNEL: 'Thay đổi 1 channel',
    CHANGE_NAME_OF_GROUP: 'Đã đổi tên nhóm thành:',
    CHANGE_AVATAR_OF_GROUP: 'Ảnh đại diện nhóm đã thay đổi',

    REMOVE_MEMBER_FROM_GROUP: 'Đã xóa thành viên ra khỏi nhóm',
    REMOVE_MANAGER_TO_GROUP: 'Đã xóa quyền quản lý',
    REMOVE_PIN_MESSAGE: 'Gỡ ghim 1 tin nhắn',
    REMOVE_CHANNEL: 'Xóa 1 channel',
};

const Key = {
    REDIS_PROFILE: 'Profile',
    REDIS_CONVERSATION: 'Conversation',
    REDIS_MEMBER: 'Member',
    REDIS_MESSAGE: 'Message',
    REDIS_CHANNEL: 'Channel',
    REDIS_STICKER: 'Sticker',
};

const TypeImage = ['image/png', 'image/jpeg', 'image/gif'];
const TypeVideo = ['video/mp3', 'video/mp4'];
const TypeDocument = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.rar',
    'application/x-rar-compressed',
    'application/octet-stream',
    'application/zip',
    'application/octet-stream',
    'application/x-zip-compressed',
    'multipart/x-zip',
];
const TypeFiles = [...TypeImage, ...TypeVideo, ...TypeDocument];

const FileExtension = {
    NAME_FILE: 'TALO',
    RAR: 'application/vnd.rar',
    ZIP: 'application/zip',
};

// !!!! Khai báo giá trị chỉ được: thêm

const TypeMessageText = ['TEXT', 'HTML', 'NOTIFY', 'STICKER'];
const TypeMessageFile = ['VIDEO', 'FILE', 'IMAGE'];
const TypeMessage = ['VOTE', ...TypeMessageText, ...TypeMessageFile];

const TypeReacts = ['HEART', 'LAUGH', 'WOW', 'SAD', 'ANGRY', 'LIKE', 'DISLIKE'];

const TypeRole = ['USER', 'ADMIN'];

const TypeRelationship = ['FRIEND', 'CLOSE_FRIEND', 'ACQUAINTANCES', 'LOVER'];

const TypeConversation = ['GROUP', 'DUAL', 'SINGLE'];

const FRIEND_STATUS = ['NOT_FRIEND', 'FRIEND', 'FOLLOWER', 'FOLLOWING'];

const TypeReport = ['APP', 'USER', 'CONVERSATION'];

module.exports = {
    ErrorType,
    Permission,
    Notification,
    Key,
    FRIEND_STATUS,
    FileExtension,
    TypeImage,
    TypeVideo,
    TypeDocument,
    TypeFiles,
    TypeMessageText,
    TypeMessage,
    TypeReacts,
    TypeConversation,
    TypeRole,
    TypeRelationship,
    TypeReport,
};
