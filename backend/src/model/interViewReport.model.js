const mongoose = require("mongoose");

mongoose.set("strictQuery",false);


const technicalQuestionSchema = new mongoose.Schema({
  question:{
    type:String,
    required:[true,"Question is required"]
  },
  intention:{
  type:String,
  required:[true,"Intention is required"]
},
  answer:{
    type:String,
    required:[true,"answer is required"]
  }
},{_id:false});
const behaviourQuestionSchema = new mongoose.Schema({
  question:{
    type:String,
    required:[true,"Question is required"]
  },
  intention:{
  type:String,
  required:[true,"Intention is required"]
},
  answer:{
    type:String,
    required:[true,"answer is required"]
  }
},{_id:false});
const skillGapSchema= new mongoose.Schema({
  skill:{
    type:String,
    required:[true,"Question is required"]
  },
  severity:{
    type:String,
    enum:["low","medium","high"],
  }
},{_id:false});
const preparationPlainSchema= new mongoose.Schema({
  day:{
    type:Number,
    required:[true,"Day is required"]
  },
  focus:{
    type:String,
    required:[true,"Focus is required"]
  },
  tasks:[{
    type:String,
    required:[true,"Tasks is required"]
  }]
},{_id:false});


const InterViewReportSchema = new mongoose.Schema({
  jobDescription:{
    type:String,
    required:[true,"Job Description is required"]
  },
  resumeText:{
    type:String
  },
  selfDescription:{
    type:String
  },
  matchScore:{
    type:Number,
    min:0,
    max:100
  },
  technicalQuestions:{
   type: [technicalQuestionSchema],
   default:[]
  },
  behavioralQuestions:{
    type:[behaviourQuestionSchema],
    default:[]
  },
  skillGaps:{
    type:[skillGapSchema],
    default:[]
  },
  preparationPlan:{
   type: [preparationPlainSchema],
   default:[]
  },
  // user:{
  //   type:mongoose.Schema.Types.ObjectId,
  //   ref:"Fullstack_GenAi_user"
  // }
  
},{timestamps:true});

const InterViewReportModel = mongoose.model("InterViewreport",InterViewReportSchema);



module.exports = InterViewReportModel;