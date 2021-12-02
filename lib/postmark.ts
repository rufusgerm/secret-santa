let postmark = require("postmark");
import ServerClient from "postmark/dist/client/ServerClient";

declare global {
  var emailClient: ServerClient;
}

if (process.env.NODE_ENV === "production") {
  emailClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY!);
} else {
  console.log("Checking if email client already exists...");
  if (!global.emailClient) {
    console.log("No email client, creating one...");
    emailClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY!);
  } else {
    console.log("It does, grabbing current email instance...");
    emailClient = global.emailClient;
  }
}

export default emailClient;
