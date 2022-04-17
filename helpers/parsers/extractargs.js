//I hate that I have to do this...maybe I just dont know how to do it properly in Sapphire framework
module.exports = function extractArgs(args) {
  var rawArgStringArray = args.parser.parserOutput.ordered;
  var rawStringJoined;
  for (const arg in rawArgStringArray) {
    if (rawStringJoined) {
      rawStringJoined += " " + rawArgStringArray[arg].value;
    } else {
      rawStringJoined = rawArgStringArray[arg].value;
    }
  }

  return rawStringJoined;
};
