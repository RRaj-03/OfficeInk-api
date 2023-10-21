require('dotenv').config();
const  OpenAI= require ('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });


///Prompting for Post generation starts here_______*******************************************************************  
  function genSysPromptForPost(ud) {
    return "".concat(
      "% INSTRUCTIONS",
      "- You are an AI Bot that is very good at mimicking an author's writing style.",
      "- Your goal is to write content in the manner of the below examples",
      "- Do not go outside the tone instructions below",
      "% Description of the author's tone:\n",
      "#1 LinkedIn's new AI features!!!!!\n",
       "Recruitment is like a funnel for HRs\n",
       "This new AI assisted recruiter will enable recruiters to manage their recruiting with more control\n",
       "Great move by LinkedIn- this might increase paid subscriptions, eventually adding to the revenue\n",

      "#2 QR codes will never look boring from now on.\n",
       "With cafes spending so much on aesthetics, ambience, i think it's time for them to upgrade their menu QR codes.\n",
       "What do you think?\n",
      "#3 Thanks Microsoft and Infobip for the wonderful session and Congratulations for the new partnership.\n",
        "💰Conversational commerce is gonna boom and it's happening as we talk. Great insights on how companies like Flipkart and udaan.com are leveraging Infobip's innovative communication Omnichannel platform in their businesses, especially in marketing.\n",
        "PS: All those Flipkart whatsapp marketing messages you receive come through Infobip.\n",
        "❣️I personally tried Infobip's 'Answers'(their chatbot builder).\n",
        "No doubt: It's has the cleanest UI and easiest UX, for a drag and drop chatbot builder. I liked their pricing as well.\n",
        "Kudos team Infobip!\n",
        "If you are a business and want to connect to your customers via Whatsapp, Messenger, SMS, email you name it, do try out Infobip.\n",
        "Can't wait to see ChatGPT integration into Infobip!\n",
      "#marketing #communication #business #openai #ecommerce #commerce #whatsapp\n",
    );
  }

  function genUserPromptForPost(ud) {
    // console.log(body)
    return "".concat(
      "% YOUR TASK\n",
      "Please create a linkedin post as Abhinav Singh on the following topic.",
      "Post length=",
          ud.length,   
      "\n-Don't use hashtags\n",
      "%TOPIC/BRAIN DUMP BY USER/INSTRUCTIONS BY USER='",
         ud.brainDump,
        "'"
      );
  }
/*-------------*********** END   ***********-------------------*/



///Prompting for RePost generation starts here_______*******************************************************************
function genSysPromptForRePost(ud) {
  return "".concat(
    "You are a Linkedin rePost creator for user. User will give you his input as USER_INPUT and a AUTHOR_POST that hw will rePost from his handle,You have to generates post content for rePost on a post on Linkedin.\n",
    "follow the below guidelines:\n",
    "1. tag the author while writing post content using Author_Name\n",
    "2. Post should not contain any hashtags unless USER specifies\n",
    "3. Post should be related to USER_INPUT\n",
    "4. Post should be related to USER's profession\n",
    "5. Post should be related to AUTHOR_POST content\n",
    "6.Add emojis to the post if USER specifies\n",
  );
}

function genUserPromptForRePost(ud) {
  // console.log(body)
  return "".concat(
    "USER_INPUT='",
    ud.brainDump,
    "\nAuthor_Name=",
    ud.authorName,
    "\nAUTHOR_POST=",
    ud.authorPost,
    "'"
    );
}
/*-------------*********** END   ***********-------------------*/


//************************************Prompting for Comment generation starts here_______*******************************


function genSysPromptForComment(ud) {
  return "".concat(
    "% INSTRUCTIONS\n",
    "- You are an INDIAN AI Bot specialized in creating content for Indian LinkedIn users.\n",
    "- Your goal is to write content according to the TO, LENGTH, TONE/INTENT,  INSTRUCTIONS from commenter and POST described below.\n",
    " - Do not go outside the tone instructions below\n",
    "- Take instructions from commenter very seriously\n",
    "%COMMENTOR Information\n",
    "COMMNETOR's Name=",
          ud.username,
    "\nCOMMENTOR's Bio=",
          ud.userbio,
  );
}

function genUserPromptForComment(ud) {
  let promptLen="under 10 words";

  if(ud.length=="Short"){
    promptLen="under 20 words"
  }
  else if(ud.length=="Medium"){
      promptLen="under 30 words";
  }else if(ud.length=="Long"){
      promptLen="under 50 words";
  };

  return "".concat(
    "% YOUR TASK\n",
    "Please create a linkedin post comment as 'COMMNETOR's Name' on the following post.\n",
    "-Don't use hashtags\n",
    "Commentor's Comment LENGTH=",
     promptLen,
    "\nCommentor's Comment TONE/INTENT=",
     ud.tones,
     "\nINSTRUCTIONS from Commenter=",
      ud.brainDump,
     "%\nPost\n",
     "LinkedIn Post=",
      ud.post,
      "\nPoster's Name=",
      ud.authorName,
      "\nPoster's Bio=",
      ud.authorBio
  );

}

/*-------------*********** END   ***********-------------------*/


///Prompting for  REPLY generation starts here_______*******************************************************************

function genSysPromptForReply(ud) {
  // commentThread = JSON.stringify(ud.commentThread);
  return "".concat(
    "% INSTRUCTIONS\n",
 "- You are an INDIAN AI Bot that is very good at writing content for COMMENTOR\n",
 "- Your goal is to write content according to the TO, LENGTH, TONE/INTENT,  INSTRUCTIONS from commenter, COMMENT THREAD, and POST described below.\n",
 "- Do not go outside the tone instructions below\n",
"- Take instructions from commenter very seriously\n",
"%COMMENTOR Information\n",
"COMMNETOR's Name=",
      ud.username,
"\nCOMMENTOR's Bio=",
      ud.userbio, 
  );
}

function genUserPromptForReply(ud) {
  // console.log(body)
  return "".concat(
    "% YOUR TASK\n",
"Please create a linkedin post comment reply as 'COMMNETOR's Name' for the the following comment thread and post.\n",
"-Don't use hashtags\n",
"Commentor's Comment TO=\n",
  ud.authorName,
"Commentor's Comment LENGTH=\n",
  ud.length,
"Commentor's Comment TONE/INTENT=\n",
ud.tones,
"INSTRUCTIONS from Commenter=\n",
  ud.brainDump,
  );
}


const sendToOpenAI=async(ud)=>{
          var sysP;
          var userP;

          if(ud.purpose=="comment"){
            sysP=genSysPromptForComment(ud);
            userP=genUserPromptForComment(ud);
          }
          else if(ud.purpose=="post"){
            sysP=genSysPromptForPost(ud);
            userP=genUserPromptForPost(ud);
          }
          else if(ud.purpose=="rePost"){
            sysP=genSysPromptForRePost(ud);
            userP=genUserPromptForRePost(ud);
          }
          else if(ud.purpose=="reply"){
            sysP=genSysPromptForReply(ud);
            userP=genUserPromptForReply(ud);
          }

          try {
            const res = await openai.chat.completions.create({
              model: "gpt-4",
              messages: [
                { role: "system", content: sysP },
                { role: "user", content: userP },
              ],
              temperature: 0.5,
              max_tokens: 256,
              top_p: 1,
              frequency_penalty: 0.4,
              presence_penalty: 0.6
            });
              var data = res.choices[0].message.content.trim().replace(/^\"|\"$/g, "");
              // var data = res.choices[0].message
              const tokens_used=res.usage.total_tokens;
              console.log("used token-->",tokens_used);
              return data;
            }
            catch (error) {
              if (error instanceof OpenAI.APIError) {
                console.error(error.status);  // e.g. 401
                console.error(error.message); // e.g. The authentication token you passed was invalid...
                console.error(error.code);  // e.g. 'invalid_api_key'
                console.error(error.type);  // e.g. 'invalid_request_error'
                return error;
              } else {
                // Non-API error
                console.log(error);
                return error;
              }
        }
}
          

module.exports={sendToOpenAI};
//body contains username, userbio,postername,posterbio,post,tone,len,intent,post