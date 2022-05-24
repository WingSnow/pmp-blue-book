const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream('src.txt'),
    terminal: false
});

let ws = fs.createWriteStream('output.json');

// 0: 中断；1：问题；2-5：答案；6：解析
let status = 0;

const optionKeys = ['A','B','C','D'] 
const remarkKey = '解析：'

let question = ''
let options = []
let answer = ''
let remark = ''

let outputs = []

status = 1

multiple = false
multipleCount = 0

const init = () => {
	question = ''
	options.length = 0
	answer = ''
	remark = ''
	multiple = false
}

const validate = (res) => {
	if(!res.question || !res.option_0 || !res.option_1 
		|| !res.option_2 || !res.option_3 || !res.answer || !res.remark){
		return false
	}
	return true
}

const output = () => {
	if (multiple) {
		// 多选题无法处理
		multipleCount += 1
		return
	}
	let res = {
		question: question.trim(),
		option_0: options[0].trim(),
		option_1: options[1].trim(),
		option_2: options[2].trim(),
		option_3: options[3].trim(),
		answer: answer.trim(),
		remark: remark.trim()
	}
	if(!validate(res)){
		throw res
	}
	outputs.push(res)
}


rl.on('close', () => {
	output()
	console.log(`成功读取问题${outputs.length}个，${multipleCount}个多选题被舍弃，保存到./output.json`)
	ws.write(JSON.stringify(outputs))
})

rl.on('line', (line) => {
	line = line.trim()
	// 切换到下一个或结束
	if(status == 6 && 
		(line.match(/^\d*\、\s\[.选\]/)?.index == 0
		||
		line.length == 0)
	 ){
		output()
		init()
		status = 1
	}
	if(status == 1){
		// 遇到A.开头的行时结束读取问题，开始读取答案
		if(line.match(/^[A-Z](\s)*：/)){
			status = 2
		} else {
			// 跳过问题开头的序号
			if(question.length == 0){
				line = line.replace(/^\d*\、\s\[.选\]/, '').trim()
			}
			question += line
			return
		}
	}
	// 逐项读取答案ABCD
	if(status >= 2 && status <= 5){
		const regex = line.match(/^([A-Z])(?=(\s)*：)/)
		if(regex && regex[0] == optionKeys[status - 2]){
			options[status - 2] = line.replace(/^[A-Z](\s)*：/,'').trim()
			return
		}
		else if(regex && regex[0] == optionKeys[status - 1]){
			status += 1
			options[status - 2] = line.replace(/^[A-Z](\s)*：/,'').trim()
			return
		}
		else if(line.startsWith('正确答案')){
			status = 6
		}
	}
	// 读取答案和解析
	if(status == 6){
		if(answer.length <= 0){
			if(line.startsWith('正确答案')){
				matchAnswer = line.match(/(?<=(正确答案)：)(.*)(\s)/)
				if(matchAnswer[0].split(',').length > 1) {
					multiple = true
				}
				if(matchAnswer != null) {
					answer = matchAnswer[0].trim()
				}
				return
			}
		}
		// 跳过解析开头的“解析：”
		if(remark.length == 0){
			remark += line.replace(/^(解析：)*/, '')
		}
		else{
			remark += line
		}
	}
});