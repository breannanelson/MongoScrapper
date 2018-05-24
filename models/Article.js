var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  headline:  {
      type: String
    //   unique: true
  },
  summary: {
      type: String,
      required: true
    //   unique: true
  },
  url: {
      type: String,
      required: true
    //   unique: true
  },
  saved: {
    type: Boolean,
    default: false,
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
