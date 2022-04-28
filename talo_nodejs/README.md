# TALO WEB CHAT - Nodejs Express

** Version: 1.0.7 **

Talo mail: <talo.noreply@gmail.com>
Talo phone: +17755264592 (SMS, MMS, and voice capable)

---

## API URL MAIN

### Account `/account`

-   `[POST] /register`: Đăng ký.
    -   body: {name: String, username: String, password: String}.
-   `[POST] /reset-otp`: Tạo lại otp mới.
    -   body: {username: String}.
-   `[POST] /verify-account`: Xác nhận otp account.
    -   body: {username: String, otp: String}.
-   `[POST] /login`: Đăng nhập
    -   body: {username: String, password: String}.
    -   result: {token: String, refreshToken: String}.
-   `[POST] /refresh-token`: Tạo lại access token.
    -   body: {refreshToken: String}.
    -   result: {token: String}.
-   `[GET] /info/:username`: lấy thông tin tóm tắt của user.
    -   result: {name: String, username:String, avatar:{url: String, name: String}, isActived: boolean }

### Profile `/profile`

-   `[GET]`: lấy thông tin của người đăng nhập.
    -   result: {name: String,avatar: :{url: String, name: String},coverPhoto: :{url: String, name: String}, dateOfBirth: {day: int, month: int, year: int}, gender: boolean, phoneBooks: Array, isActived: boolean, isAdmin: boolean}
-   `[PUT]`: Cập nhật thông tin người đăng nhâp.
    -   body: {name: String, dateOfBirth: {day: int, month: int, year: int}, gender: boolean}
-   `[PATCH] /avatar`: Cập nhật ảnh đại diện bằng file ảnh
    -   body: {file: File}.
    -   result: {filename: String, publicUrl: String}.
-   `[PATCH] /avatar/base64`: Cập nhật ảnh đại diện bằng chuỗi base64
    -   body: {fileOrigin: String, fileBase64: String}.
    -   result: {filename: String, publicUrl: String}.
-   `[PATCH] /cover-photo`: Cập nhật ảnh bìa bằng file ảnh
    -   body: {file: File}.
    -   result: {filename: String, publicUrl: String}.
-   `[PATCH] /cover-photo/base64`: Cập nhật ảnh bìa bằng chuỗi base64
    -   body: {fileOrigin: String, fileBase64: String}.
    -   result: {filename: String, publicUrl: String}.
-   `[POST] /contacts`: Đồng bộ số điện thoạt.
    -   body: [{name: String, phone: String}]
-   `[GET] /contacts`: Lấy danh sách danh bạ.
    -   result:
        -   **nếu không tồn tại** [{name: String, phone: String, isExists: false}]
        -   **Nếu có người dùng** [{status: int, numberMutualGroup: int, numberMutualFriend: int, isExists: true, name: String, username: String, avatar: :{url: String, name: String},coverPhoto: :{url: String, name: String}, dateOfBirth: {day: int, month: int, year: int}, gender: boolean}]
-   `[PATCH] /change-password`: Đổi mật khâu.
    -   body: {currentPassword: String, newPassword: String}
-   `[DELETE] /logout-all`: Đăng xuất tất cả thiết bị
    -   body: {password: String, key: String}.
    -   result: {token: String, refreshToken: String}.

### User `/users`

-   `[GET] /find/username/:username`: Tìm kiếm thông tin của người dùng bằng username
    -   result: { name: String, username: String, avatar: :{url: String, name: String},coverPhoto: :{url: String, name: String}, dateOfBirth: {day: int, month: int, year: int}, gender: boolean, status: String, numberMutualGroup: int, numberMutualFriend: int}
-   `[GET] /find/id/:id`: Tìm kiếm thông tin của người dùng bằng username
    -   result: { name: String, username: String, avatar: :{url: String, name: String},coverPhoto: :{url: String, name: String}, dateOfBirth: {day: int, month: int, year: int}, gender: boolean, status: String, numberMutualGroup: int, numberMutualFriend: int}

### Friend `/friend`

-   `[GET]`: Danh sách bạn bè.
    -   query: {name: String}
    -   result: [{id: String, name: String, avatar: avatar: {url: String, name: String} isOnlien: boolean, lastOnline: Date}]
-   `[DELETE] /:userId`: Xóa bạn bè.
    -   body: {userId: String}
-   `[GET] /requests`: Danh sách yêu cầu kết bạn.
    -   result: [{id: String, name: String, avatar: avatar: {url: String, name: String}, numberMutualGroup, numberMutualFriend}]
-   `[POST] /requests`: Đồng ý kết bạn bạn bè.
    -   body: {userId: String}
    -   result: {conversationId: String, isExists: boolean, message: {id: String, handledUserIds, content: String, tags: [], type: String, deletedUserIds: [], reacts: [], options: [], createdAt: Date, user:{id: String, members: {id: String, name, avatar}}}}
-   `[DELETE] /requests/:userId`: Xóa yêu cầu kết bạn.
    -   body: {userId: String}
-   `[GET] /requests/me`: Danh sách yêu cầu kết bạn của bạn.
    -   result: [{id: String, name: String, avatar: avatar: {url: String, name: String}, numberMutualGroup, numberMutualFriend}]
-   `[POST] /requests/me`: Gửi yêu cầu kết bạn từ bạn.
    -   body: {userId: String}
    -   result: {conversationId: String, isExists: boolean, message: {id: String, handledUserIds, content: String, tags: [], type: String, deletedUserIds: [], reacts: [], options: [], createdAt: Date, user:{id: String, members: {id: String, name, avatar}}}}
-   `[DELETE] /requests/me/:userId`: Xóa yêu cầu kết bạn của bạn.
    -   body: {userId: String}
-   `[GET] /suggest`: Gợi ý kết bạn

### Classify `/classify`

-   `[GET]`: Danh sách phân loại.
    -   result: [{ id:String, name: String, color: String, countConversations: int }]
-   `[POST]`: Thêm phân loại.
    -   body: { color: String, name: String }
    -   result: { id: String }
-   `[PUT]`: Sửa phân loại.
    -   body: { id: String, name: String, color: String }
    -   result: boolean
-   `[DELETE] /:id`: Xóa phân loại.
-   `[GET] /conversations/:id`: Danh sách cuộc hội thoại theo id phân loại.
    -   result: {id:String, name: String, color: String, conversations: [{ id: String, avatar: {url: String, name: String}, pinMessageIds: [ ], type: String}]}
-   `[POST] /conversations/:id/:conversationId`: Thêm hội thoại vào phân loại.
-   `[DELETE] /conversations/:id/:conversationId`: Xóa hội thoại trong phân loại.

### Conversation `/conversations`

-   `[GET]`: Danh sách cuộc hội thoại.
    -   result: [{ id: String, name: String, avatar: {url: String, name: String}, type: String, members: [{ id: String, name: String, avatar: {url: String, name: String} }], totalMembers: int, numberUnread: int, isNotify: boolean, isJoinFromLink: boolean, lastMessage: { handledUserIds, content, tags, type, deletedUserIds...} }]
-   `[GET] /:id`: Chi tiết cuộc hội thoại.
    -   result: { id: String, name: String, avatar: {url: String, name: String}, type: String, members: [{ id: String, name: String, avatar: {url: String, name: String} }], totalMembers: int, numberUnread: int, isNotify: boolean, isJoinFromLink: boolean, lastMessage: { handledUserIds, content, tags, type, deletedUserIds...} }
-   `[POST]`: Thêm cuộc hội thoại nhóm.
    -   body: { userIds: [ String,... ]}
    -   result: {id: String}
-   `[POST]/dual/:userId`: Lấy cuộc hội thoại đôi.
    -   result: { conversationId: String, isExists: Boolean }
-   `[POST] /cloud`: Lấy cuộc hội thoại cloud.
    -   result: { conversationId: String, isExists: Boolean }
-   `[DELETE] /:id`: Xóa cuộc hội thoại nhóm.
-   `[PATCH] /:id/name`: Đổi tên cuộc hội thoại.
-   `[PATCH] /:id/avatar`: Đổi avatar cuộc hội thoại.
-   `[PATCH] /:id/avatar/base64`: Đổi avatar cuộc hội thoại.
-   `[PATCH] /:id/notify`: Đổi nhận thông báo cuộc hội thoại.
    -   body: { isNotify: boolean}
-   `[PATCH]/:id/join-with-link`: Đổi truy cập bằng link cuộc hội thoại.
    -   body: { isStatus: boolean}
-   `[POST] /:id/join-with-link`: Truy cập bằng link cuộc hội thoại.
-   `[GET] /:id/members`: Danh sách thành viên cuộc hội thoại.
    -   result: [{ id: String, name: String, avatar: avatar: {url: String, name: String}}]
-   `[POST] /:id/members`: Thêm danh sách user vào cuộc hội thoại.
    -   body: [ String,...]
    -   result: { id: String handledUserIds: { id: String, name: String, avatar: {url: String, name: String}}, content: String, tags: [], type: String, deletedUserIds: [], reacts: [], options[], createdAt: Date, user: {id: String, name: String, avatar: {url: String}} }
-   `[DELETE] /:id/members`: Rời khỏi cuộc hội thoại nhóm.
    -   result: { handledUserIds, content, tags, type, deletedUserIds...} }
-   `[DELETE] /:id/members/:userId`: Xóa user khỏi cuộc hội thoại nhóm.
    -   result: { handledUserIds, content, tags, type, deletedUserIds...} }
-   `[POST] /:id/managers`: Thêm các quản lý cho nhóm trò truyện.
    -   body: [ String,...]
    -   result: { handledUserIds, content, tags, type, deletedUserIds...} }
-   `[PATCH] /:id/managers`: Xóa các quản lý cho nhóm trò truyện.
    -   body: [ String,...]
    -   result: { handledUserIds, content, tags, type, deletedUserIds...} }
-   `[GET] /:id/short-info`: Thông tin nhóm trò truyện.
    -   result: { id: String, name: String, avatar: {url: String, name: String}, members: [{ id: String, name: String, avatar: {url: String}}]}
-   `[GET] /:id/view-last`: Danh sách các thành viên đã xem tin nhắn.
    -   result: { id: String, user: { id: String, name: String, avatar: {url: String, name}}, lastView: Date}
-   `[DELETE] /:id/messages`: Xóa tất cả tin nhắn.

### Channel `/channels`

-   `[GET] /:conversationId`: Danh sách các channel theo convertionId
    -   result: [ { id: String, name: String, description: String, conversationId: String, createdAt: Date}]
-   `[POST] /:conversationId`: Tạo channel
    -   body: { name: String, description: String}
    -   result: { channel: { id: String, name: String, description: String, conversationId: String, createdAt: Date}, message: { id: String type: String, content: String, user: { id: String, name: String, avatar: {url: String, name: String}},...}}
-   `[PUT] /:channelId`: Sửa channel
    -   body: { name: String, description: String}
    -   result: { channel: { id: String, name: String, description: String, conversationId: String, createdAt: Date}, message: { id: String type: String, content: String, user: { id: String, name: String, avatar: {url: String, name: String}},...}}
-   `[DELETE] /:channelId`: Xóa channel
    -   result: { conversationId: String, message: { id: String type: String, content: String, user: { id: String, name: String, avatar: {url: String, name: String}},...}}
-   `[GET] /:channelId/view-last`: User xem lần cuối
    -   result: [ { user: { id: String, name: String, avatar: {url: String, name: String}}, lastView: Date }]

### Sticker `/sticker`

-   `[GET]`: Danh sách các sticker
    -   result: [ { id: String, name: String, description: String, emoji: [ { url: string, name: String}]}]

### Message `/message`

-   `[GET] /:conversationId`: Danh sách tin nhắn theo id hội thoại
    -   query: { page: int, size: int }
    -   result: { data: [ { _id, handledUserIds, content, tags, type, deletedUserIds, reacts, options, createdAt, user}, page: int, size: int, totalPages: int]}
-   `[GET] /channel/:channelId`: Danh sách tin nhắn theo id channel
    -   query: { page: int, size: int }
    -   result: { data: [ { _id, handledUserIds, content, tags, type, deletedUserIds, reacts, options, createdAt, user}, page: int, size: int, totalPages: int]}
-   `[GET] /:conversationId/files`: Danh sách file theo id hội thoại
    -   query: {userIdSend: String, type: String, startTime: String(yyyy-mm-dd) , endTime: String(yyyy-mm-dd)}
-   `[POST] /:conversationId/text`: Gửi tin nhắn chữ (TEXT, HTML, NOTIFY, STICKER)
    -   body: {content: String , tags: [{ String }], replyMessageId: String, type: String, channelId: String}
    -   result: message
    -   Socket: emit { 'MessageNew' , conversationId, message}
        -   Channel: emit { 'MessageNewChannel', conversationId, channelId, message}
-   `[POST] /:conversationId/file`: Gửi tin nhắn file (IMAGE, VIDEO, FILE)
    -   body { type: String, channelId: String, file: File}
    -   result: message
    -   Socket: emit { 'MessageNew' , conversationId, message}
        -   Channel: emit { 'MessageNewChannel', conversationId, channelId, message}
-   `[POST] /reacts/:id/:type`: Cảm xúc cho tin nhắn
    -   Socket: emit {MessageReactAdd, { conversationId, channelId, messageId, type, user, }}
-   `[POST] /forward/:id/:conversationId`: Chuyển tiếp tin nhắn
    -   Socket: Emit { 'MessageNew' , conversationId, message}
-   `[DELETE] /unsend/:id`: Thu hồi tin nhắn
    -   Socket: Emit { MessageDelete, { conversationId, channelId, messageId} }
-   `[DELETE] /unsend/:id/just-me`: Xóa tin nhắn phía mình

---

## API URL OTHER

### Search `/search`

-   `[GET] /conversation`: Tìm kiếm cuộc hội thoại.
    -   query: { q: String, page: int, size: int}
-   `[GET] /message`: Tìm kiếm tin nhắn cuộc hội thoại.
    -   query: { q: String, page: int, size: int}
-   `[GET] /file`: Tìm kiếm file cuộc hội thoại.
    -   query: { q: String, page: int, size: int}

### Report `/report`

-   `[POST] /app`: Báo lỗi ứng dụng
    -   body: {title, description }
-   `[POST] /convercation`: Báo cáo cuộc hội thoại
    -   body: {title, description, conversationId}
-   `[POST] /user`: Báo cáo người dùng
    -   body: {title, description, userIsReport}

---

## API URL ADMIN

### Statistic `/statistic`

### Sticker `/sticker`

-   `[POST]`: Tạo sticker
    -   body: { name: String, description: String }
    -   result: [ { id: String, name: String, description: String, emoji: [ { url: string, name: String}]}]
-   `[PUT]/:stickerId`: Sửa sticker
    -   body: { name: String, description: String }
    -   result: [ { id: String, name: String, description: String, emoji: [ { url: string, name: String}]}]
-   `[DELETE]/:stickerId`: Xóa sticker
-   `[POST]/:stickerId/emoji`: Thêm emoji cho sticker
    -   body: {file: File}
    -   result: URL
-   `[DELETE]]/:stickerId/emoji`: Thêm emoji cho sticker
    -   query: {name: String}
    -   result: URL

---

## SOCKET IO

### IO: connection

-   On: connection
    -   message: mesage
        -   Emit message-server: message
    -   UserOnline: userId
        -   join: userId
    -   UserOffline: userId
    -   UserGetStatus: userId, callback({ isOnline, lastLogin })
    -   ConversationsJoin: conversationIds
        -   join: [ consersationId,... ]
    -   ConversationJoin: conversationId
        -   join: conversationId
    -   ConversationLeft: conversationId
        -   leave: conversationId
    -   ConversationUserTyping: conversationId, userId
        -   Emit conversationId: 'ConversationTyping', conversationId, userId
    -   ConversationUserTypingFinish: conversationId, userId
        -   Emit conversationId: 'ConversationTypingFinish', conversationId, userId
    -   ConversationVideoCallJoin: conversationId, userId, peerId
        -   join: TaloCall + conversationId
        -   Emit TaloCall + conversationId: 'ConversationVideoCallJoin', {conversationId, userId, peerId}
    -   ConversationsChannelViewLast: conversationId, channelId

### IO: Channels

-   On: conversationId
    -   Emit: ChannelCreate, channel
    -   Emit: ChannelUpdate, channel
    -   Emit: ChannelDelete, { conversationId, channelId }

### IO: Conersation

-   On: conversationId
    -   Emit: ConversationDelete, conversationId
    -   Emit: ConversationChangeName, conversationId, name, message
    -   Emit: ConversationChangeAvatar, conversationId, avatar, lastMessage
    -   Emit: ConversationMemberUpdate, conversationId
    -   Emit: ConversationManagerAdd, conversationId, managerIds
    -   Emit: ConversationManagerDelete, conversationId, managerIds
-   On: userId
    -   Emit: ConversationGroupCreate, conversationId
    -   Emit: ConversationDuaCreate, conversationId
    -   Emit: ConversationMemberAdd, conversationId
    -   Emit: ConversationDelete, conversationId

### IO: Friend

-   On: userId
    -   Emit: FriendDelete, userId
    -   Emit: FriendAccept, userId
    -   Emit: ConversationDuaCreate, conversationId
    -   Emit: FriendRequestDelete, userId
    -   Emit: FriendRequestSend, { id, name, avatar }
    -   Emit: FriendRequestByMeDelete, userId

### IO: Message

-   On: conversationId
    -   Emit: MessageViewLast, conversationId, userId, lastView
    -   Emit: MessageViewLast, conversationId, channelId, userId, lastView
    -   Emit: MessageNewChannel, conversationId, channelId, message
    -   Emit: MessageNew, conversationId, message
    -   Emit: MessageReactAdd, { conversationId, channelId, messageId, type, user}
    -   Emit: MessageDelete, { conversationId, channelId, messageId}

### IO: Pin Message

-   On: conversationId
    -   Emit: MessagePinAdd, conversationId
    -   Emit: MessagePinDelete, conversationId

### IO: Poll

-   On: conversationId
    -   Emit: PollOptionUpdate, conversationId, message
    -   Emit: PollChooseUpdate, conversationId, message

### IO: Profile

-   On: userId
    -   Emit: LogoutAll, { key }

---

## License & copyright

© Nocopyright Development707
