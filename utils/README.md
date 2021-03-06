一个将固定格式（参考示例）的题目转为json格式，以便后续处理或导入数据库存储的小工具。

# 使用方法

复制题目到文本，命名为`src.txt`，放在与代码文件`dataParser.js`同一目录下。

运行代码文件

```bash
node .\dataParser.js
```

解析后的数据保存在同一路径下的`output.json`文件中（覆盖原文件）。

# 示例

输入文件 `src.txt` :

```
1、 [多选] 在项目执行阶段,生产经理要求项目经理包含一项已经证明可以显著提高产量的变更,项目经理首先应该做什么?
During a project's execution phase,the production manager asks the project manager to incorporate a change that has been proven to significantly increase output.What should the project manager do first?
 A ： 向变更控制委员会(CCB)提交一份变更请求 Submit a change request to the change control board(CCB)
 B ：要求生产经理进行成本效益分析 Ask the production manager to conduct a cost-benefit analysis
 C ：包含提议的变更 Incorporate the proposed change
 D ：更新变更日志 Update the change log
正确答案：A 你的答案：A
解析：知识点出处：PMBOK 6th 页码：P113 章节：4.6 变更流程：变更提出后，先分析影响，再提交含解决措施的变更请求给CCB。 审批前，三步骤：提出变更-分析影响-提交审批
2、 [多选] 根据项目的特点，项目经理建议选择一种敏捷方法，该方法限制团队成员在任何给定时间执行的任务数。此方法还允许团队提高工作过程中问题和瓶颈的可见性。项目经理建议采用以下哪种方法？
Based on the characteristics of the project, the project manager suggests selecting an agile method that limits the number of tasks being worked on by the team members at any given time. This method will also allow the team to increase the visibility of issues and bottlenecks in their work process. Which of the following methods does the project manager suggest?
 A ： 看板 Kanban
 B ：Scrum Scrum
 C ：水晶 Crystal
 D ：改善 Kaizen
正确答案：A 你的答案：A
解析：知识点出处：敏捷实践指南 页码：P103 章节：A3.4 看板方法：通过限制在制品将可以提高工作效率和质量。
3、 [多选] 在项目的第一个阶段发布给客户的最新软件充满了缺陷。客户很生气，并要求计划在第二阶段交付的新版本的开发过程更加透明。客户希望更有规律地看到团队的结果，而不需要很长的开发间隔。 项目团队可以在第二阶段引入下列哪项来更好地满足客户的要求? (选择四个）
The latest software released to the customer in the first project phase is full of defects. The customer is angry and demands that the development of the new release, which is planned to be delivered in the second phase, is much more transparent. The customer wants to see the team’s results more regularly and without very long development intervals in-between. Which of the following could the project team introduce in the second phase to better comply with the customer's demand? (Choose four)
 A ： 有规律时间框的节奏 A cadence with regular timeboxes
 B ： 定期和频繁的回顾 Regular and frequent retrospectives
 C ：在每个团队成员的层次上进行优化 Optimization at the level of each individual team member
 D ： 测试驱动的开发实践 Test-driven development practices
 E ： 使用待办事项列表进行增量交付 Incremental delivery using a backlog
 F ：在软件发布之前限制更改的数量 Limiting the number of changes before the software is released
正确答案：A,B,D,E 你的答案：A,B,D,E

```

输出文件 `output.json`（格式化后）:

```json
[{
	"question": "在项目执行阶段,生产经理要求项目经理包含一项已经证明可以显著提高产量的变更,项目经理首先应该做什么?During a project's execution phase,the production manager asks the project manager to incorporate a change that has been proven to significantly increase output.What should the project manager do first?",
	"option_0": "向变更控制委员会(CCB)提交一份变更请求 Submit a change request to the change control board(CCB)",
	"option_1": "要求生产经理进行成本效益分析 Ask the production manager to conduct a cost-benefit analysis",
	"option_2": "包含提议的变更 Incorporate the proposed change",
	"option_3": "更新变更日志 Update the change log",
	"answer": "A",
	"remark": "知识点出处：PMBOK 6th 页码：P113 章节：4.6 变更流程：变更提出后，先分析影响，再提交含解决措施的变更请求给CCB。 审批前，三步骤：提出变更-分析影响-提交审批"
}, {
	"question": "根据项目的特点，项目经理建议选择一种敏捷方法，该方法限制团队成员在任何给定时间执行的任务数。此方法还允许团队提高工作过程中问题和瓶颈的可见性。项目经理建议采用以下哪种方法？Based on the characteristics of the project, the project manager suggests selecting an agile method that limits the number of tasks being worked on by the team members at any given time. This method will also allow the team to increase the visibility of issues and bottlenecks in their work process. Which of the following methods does the project manager suggest?",
	"option_0": "看板 Kanban",
	"option_1": "Scrum Scrum",
	"option_2": "水晶 Crystal",
	"option_3": "改善 Kaizen",
	"answer": "A",
	"remark": "知识点出处：敏捷实践指南 页码：P103 章节：A3.4 看板方法：通过限制在制品将可以提高工作效率和质量。"
}]
```

