declare module "nodemailer";
declare module "graphql-ws/use/ws";

declare module "http" {
  interface IncomingMessage {
    rawBody: string;
  }
}
