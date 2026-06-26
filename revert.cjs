
const fs = require('fs');
const transcript = fs.readFileSync('C:\\\\Users\\\\DivTech_expertbook2\\\\.gemini\\\\antigravity-ide\\\\brain\\\\20801aab-832b-4785-93ad-39c6261aacf6\\\\.system_generated\\\\logs\\\\transcript.jsonl', 'utf8');
const lines = transcript.split('\n').filter(Boolean).map(l => JSON.parse(l));
for (const line of lines) {
  if (line.type === 'PLANNER_RESPONSE' && line.tool_calls) {
    for (const call of line.tool_calls) {
      if (call.name === 'default_api:multi_replace_file_content' || call.name === 'default_api:replace_file_content') {
        console.log('Instruction:', call.arguments.Instruction, 'File:', call.arguments.TargetFile);
      }
    }
  }
}

