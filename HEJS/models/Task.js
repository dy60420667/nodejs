var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var TaskSchema = new Schema({
	package : String,
	version : String,
	versionnumber : String,
	company:[String],
	create_date : { type: Date, default: Date.now }
});
var Task = mongodb.mongoose.model("Task", TaskSchema);
var TaskDao = function(){};
module.exports = new TaskDao();
