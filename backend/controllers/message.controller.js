export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filterredUsers = await User.find({ _id: { $ne:loggedInUserId } }).select("-password");

        res.status(200).json(filterUsers);
    } catch (error) {
        console.error('Error getting users for sidebar:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
    };

    export const getMessages = async (req, res) => {
        try {
           const {id:userToChatId}=req.params
           const senderId=req.user._id;

           const messages=await Message.find({
            $or: [
                { sender: senderId, receiver: userToChatId },
                { sender: userToChatId, receiver: senderId },
                
            ]
        })
        res.status(200).json(messages);
        } catch (error) {
            console.error('Error getting messages:', error.message);
            res.status(500).json({ message: 'Internal server error' });
    }};
    export const sendMessage = async (req, res) => {
        try {
            const { text,image } = req.body;
            const { id: receiverId } = req.params;
            const senderId = req.user._id;

            let imageUrl;
            if (image) {
                const uploadImage = await cloudinary.uploader.upload(image);
                imageUrl = uploadImage.secure_url;
            }
            const newMessage = new Message({
                senderId,
                receiverId,
                text,
                image: imageUrl,
            });
            await newMessage.save();

            // real-time functionality goes here => socket.io

            res.status(201).json(newMessage);
        } catch (error) {
            console.error('Error sending message:', error.message);
            res.status(500).json({ message: 'Internal server error' });
            
        }
    };
        