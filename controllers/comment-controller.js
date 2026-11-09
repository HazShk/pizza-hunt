const { Comment, Pizza } = require("../models");

const commentController = {
  // add comment to pizza
  addComment({ params, body }, res) {
    console.log("👨‍🍳 addComment for pizza", params.pizzaId, "body:", body);

    // JOB 1: save the comment
    Comment.create(body)
      .then(({ _id }) => {
        console.log("💾 JOB 1 done: comment saved with _id", _id);

        // JOB 2: write that id into the pizza's comments list
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } },
          { new: true },
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        console.log(
          "🔗 JOB 2 done: pizza now has comments",
          dbPizzaData.comments,
        );
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // remove comment
  removeComment({ params }, res) {
    console.log(
      "👨‍🍳 removeComment",
      params.commentId,
      "from pizza",
      params.pizzaId,
    );
    // JOB 1: delete the comment
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((deletedComment) => {
        if (!deletedComment) {
          return res.status(404).json({ message: "No comment with this id!" });
        }
        console.log("🗑️ JOB 1 done: comment deleted");
        // JOB 2: pull its id out of the pizza's list
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true },
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        console.log(
          "✂️ JOB 2 done: pizza now has comments",
          dbPizzaData.comments,
        );
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // add reply to comment
  addReply({ params, body }, res) {
    console.log("👨‍🍳 addReply to comment", params.commentId, "body:", body);

    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true, runValidators: true },
    )
      .then((dbCommentData) => {
        if (!dbCommentData) {
          res.status(404).json({ message: "No comment found with this id!" });
          return;
        }
        console.log(
          "📎 reply stapled on, comment now has",
          dbCommentData.replies.length,
          "replies",
        );
        res.json(dbCommentData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = commentController;
