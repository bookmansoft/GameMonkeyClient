尚未完成的任务：
1、选服界面（可稍微押后）
2、普通转生、高级转生选择界面
3、转生成功界面
4、宠物列表界面整改：
    已出战宠物要将“出战”按钮自动替换为升级按钮
    提供升级变档选择：1级、25级、100级、1000级 - OK
5、每逢10关的闯关界面中，在怪物血条下方，提供一个显示可能掉落的魂石数量的复合文本框，显示内容为“可掉落(魂石图标)100”，或者由程序动态生成
6、由于服务端、客户端两边时间不同步，因此技能冷却时间需要由服务端直接送下来持续时间，而非时间戳
7、科技效果的全面修订核实
8、商场列表异常，无法顺利购买宠物，也无法执行激活宠物等后续操作 - OK
9、fennu.png缺失，暂时使用其它图片复制 - OK
10、关卡怪物有时会出现异常现象：大关出现多个Boss；Boss乱入小关中

2017.1.22 by gyy
1.修改法宝界面法宝图片的显示方式，变成异步
2.更改了法宝配置表，添加了法宝名称的显示
3.添加了与挂机相关的所有界面类
变动地方：
	增加了相应界面的类，在view/revive文件夹下
	在UIPage添加了创建各个页面的函数，还没调用。
4.添加了法宝的技能图标。龙骨动画目前看不到效果。是不能异步读取了吗？哪里写错？
变动地方:
	ItemLine类
5.法宝详情页面加了一点东西，增加了向左向右按钮
6.增加了一些按钮的三态
7.增加了一些页面，在UiPage中
8.添加了神魔的图片头像资源，修改了配置文件。修改了下神魔页面
9.更改了符咒的配置表。符咒变更为异步读取

2017.1.24 by gyy
1.更改了神魔的配置表shenmocfg，删除了目前还未出的神魔配置
2.神魔界面修改了显示，把对应的头像都显示上了，增加了名字图片，也显示上了，还有未获得的状态也显示了
3.修改闪电的资源、对位
4.修改了宠物图片的加载方式，用了异步加载，更改了下Pet类的头像图片和全身图片的函数返回
5.增加了个符咒资源，修改了配置amulet
6.修改了商店图片的加载模式，用了异步加载
7.法宝升级效果已加上，在Itemline类中
8.添加了些按钮三态
9.成就进度显示更改了滤镜的颜色
10.每日任务上增加了一个花费钻石领奖的按钮
11.法宝页面增加了升几级的按钮。

2017.2.10 liub
1、开始调整转生界面：
	点击转生时首先弹出 SeniorReviveWindow
	如果选择高级转生则直接转生，并弹出 ReviveTipsWindow 提示转生收益
	如果选择普通转生则弹出 ZSWindow，
		点击开始转生后弹出 ReviveTipsWindow，提示转生收益
			之后，在主页面上出现挂机按钮，点击后弹出 HangUpTipWindow，提示玩家选择挂机
				选择挂机后，弹出 HangUpWindow，展示挂机进度。玩家可以选择提前结束挂机
					挂机自动结束，或者玩家手动结束，将弹出 HangUpGetWindow，展示挂机收益

2、转生的变化和收益
	1、变化：
		累计转生次数
		剩余转生次数
		佛光（圣光）分配和剩余佛光点：不变
		符咒（图腾）激活状态和等级：不变
		法宝等级：普通转生时第一件法宝归1其余全部归0，高级转生不变
		法宝数量：普通转生变为1，高级转生不变
		关卡数：普通转生变为1，高级转生不变
		金币：普通转生变为10W（受科技影响），高级转生不变
		内丹（英魂）：变为0
		修为（魂石）：原有值递增数量

3、调整通关收益：
	1、击杀Boss获取魂石
	2、过关获取圣光

4、挂机功能实现：
	1、判断是否满足挂机条件
	2、开始挂机、提前终止挂机、元宝完成挂机

2017.2.14 liub
1、修复法宝列表异常的问题
2、法宝升级费用本地计算

2017.2.18 liub
1、修复符咒升级时不受最大等级限制的Bug - OK
2、全部符咒科技效果带入，其中暴击率、暴强、Boss血量下降三个科技同步在客户端带入 - OK 

2017.2.20 liub
1、点击飞行宝箱时，导入一场特殊战斗，战斗结束发送101001

2017.2.22 liub
1、点击小飞兔，发送101001，并在应答返回时，以走马灯形式显示奖励内容

2017.2.23 liub
1、显示法宝技能列表，并显示解锁状态
2、怪物血条显示要更自然一些，例如：刚出现时立刻就显示满血的血条；受己时血条是缓慢的减少下去的

2017.3.4
1、修复法宝列表中，按钮状态不明确的问题，不能升级时将显示灰色按钮
2、修复战斗流程中，可能导致永远停止战斗的问题
	1、攻击宝箱怪时，同时出现了多个宝箱怪，消灭后还会不断的补充，类似普通关卡小怪的管理模式，而正常情况下，宝箱怪应该是按照Boss模式进行管理的
	2、攻击Boss过关后，会再次进入这个关卡，重新攻击该Boss，陷入死循环中
	3、攻击完包厢怪、播放恭喜过关动画后，偶现战斗停顿、无法继续的现象
	4、偶现战斗恢复后，屏幕上有动画残留现象
	5、宠物战斗姿态和所播放动画不配套

要卸载这些所有内置应用，就要用到Windows PowerShell，它是win10系统自带的一个应用，要打开它，就单击开始菜单中的“所有应用”，然后找到Windows Power Shell的文件夹，
右键单击Windows PowerShell（注意不是Windows PowerShell ISE），然后单击以管理员身份运行，就打开了。复制粘贴下面这行代码，回车，搞定！
Get-AppxPackage *zune* | Remove-AppxPackage

PVP战场描述文件：
1、敌我双方各有三名武将组成阵型对抗，每名武将有五行属性，从而组成三才五行阵，相生相克
2、阵型中前排为T，后排为DPS，后排腾空者为控。以我方为例，描述攻击模式：
    1、T负责防御，是主要的受力方，同时负责近战攻击对方的T，也就是说，只有单点攻击模式
    2、DPS负责攻击，DPS按照攻击模式可分为只攻击T、攻击T和DPS两种，对应九宫格的单点攻击、纵向攻击
    3、控可以攻击对方的控或者T，对应九宫格的单点攻击、纵向攻击
    总的来说，提倡捉对厮杀，控对控、T对T，DPS对DPS，但略有变化
3、要求无论是近战还是远程，都要做碰撞检测，力求着弹点真实。

对象池的使用：
1、对宠物、角色、怪物使用对象池管理，避免反复创建造成的内存增长

2017.3.11
1、掉落的物品，会被自动吸附到指定地点后消失：吸附点和吸附时的闪光只是临时设定 - OK
3、实现元宝直接完成任务的功能 - OK
4、修复 领取任务奖励 后列表未刷新的问题 - OK
5、新增动画列表封装组件 - 新增项目后没有自动滚动到底部 - OK
6、法宝列表中的升级按钮，金币不足时没有自动灰态 - OK
7、每日任务中，领取奖励后，主界面上的金币元宝数要随之变动 - OK
8、为宝箱怪战斗添加Boss血条 - OK 
9、在客户端增加错误提示信息(部分) - OK
10、修复了偶尔出现的动画残留问题 - OK
-- 制作邮件界面邮件界面，以展示各类通知、攻防信息 - 提交界面制作需求 - OK  
-- 为首页上所有按钮的激活状态，提供统一的管理模式 - OK 
-- 修复宠物自动攻击Buff不能消除的bug - OK 同时对操作流程做了一定的优化

等待制作的功能：
-- 为离线奖励、过关奖励制作激活动画，当条件满足时激活，玩家点击后呈现奖励内容，同时发放奖励。
-- 为挂机按钮制作激活动画，以提示玩家可以点击，流程如下：
	1、如果处于可挂机状态，则激活挂机按钮，玩家点击后可以进行挂机操作。
	2、如果挂机结束，则直接弹出挂机收益通知界面。
-- 首页展示模式改为noBorder之后，首页UI布局需做相应调整
-- 佛光守护界面中，分配完自由点数后显示的“查看”按钮画风不对
-- 红孩儿的动画有问题，五官在受击时会滑落
-- 程序运行时偶尔会报龙骨数据错误，尚未定位资源名称
