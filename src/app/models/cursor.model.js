const mongoose = require('mongoose');
const { Schema } = mongoose;

//Model Colleciton setup
const cursorSchema = new Schema(
    {
        after: String,
        user_id: Schema.Types.ObjectId
    },
    { timestamps: true }
);

const Cursor = mongoose.model('cursor', cursorSchema);

module.exports = {
    Cursor
};