#GameClient

在Egret Wing4.0下，使用Egret Engine4.0 打包第三方JS库，在对应的bin目录下得到三个空文件（*.d.ts *.js *.min.js），请问有什么解决方案吗？
附：为防止360的影响，在关闭360的情况下，重新安装了Wing和Engine
附：在Egret Wing3、Egret Engine 3.2.5下打包、运行都是正常的。

GIT中查看指定文件的历史记录
git log 文件名
git show 哈希值

2016.1.20 更新纪要：
1.更新了闪电的资源，创建闪电的函数做了修改
变动地方：
	resource/common/shandian 文件夹资源更新
	FightManager类


2.更新了小飞狐宝箱的资源
变动地方：
	resource/common/baoxiang 文件夹资源更新

3.添加了新的飞的宝箱的资源
变动地方：
	resource/common/baoxiang_fly 添加了文件夹资源
	添加入default.res.json
	FightManager.ts 文件内添加了出现新的飞的宝箱的状况，改了下宝箱位置的限制，最大变成550

4.添加了佛光守护动画
变动地方：
	resource/foguang/foguang_sh 添加了文件夹资源
	添加入default.res.json
	BuddhaGuard.ts 文件内添加了创建守护龙骨动画函数

5.添加了佛光转移动画
变动地方：
	resource/foguang/foguang_fp03 添加了文件夹资源,resource/foguang  2张图片资源
	添加入default.res.json
	BuddhaManager.ts 文件内添加了创建转移动画函数

6.佛光守护界面添加了个初始化显示
变动地方：
	BuddhaGuard.ts 文件内添加了初始化函数
	UIPageMediator.ts 添加了初始化的调用

7.更改了佛光页面加载图片的方式，用异步加载
变动地方：
	佛光管理界面显示所要用到类的相关的函数

8.增加了技能tips
变动地方：
	增加了tips图片资源
	增加了tips皮肤以及对于的类SkillsTips
	在UIPage中增加了对于的创建函数和显示逻辑处理。

9.增加了一些按钮的三态
变动地方：
	资源增加，皮肤变动

10.增加了金币掉落，3种状态的掉落都有
变动地方：
	MonsterManage类
	增加了金币图片资源

11.增加了宝箱怪
变动地方：
	MonsterManage类
	Monster类
	增加了宝箱怪龙骨资源

12.增加了skins皮肤，对应的类还没建立
变动地方：
	在game_skins文件夹下增加了
		增加了HangUoGetWindowSkins   	挂机收益皮肤
		增加了HangUpTipWindowSkins   	挂机提示皮肤
		增加了HangUpWindowSkins	     	挂机中皮肤
		增加了ReviveTipsWindowSkins     转生贴士皮肤
		增加了SeniorReviveWindowSkins   高级转生皮肤
	在ui文件夹下增加了
		增加了ConsumeTipWindowSkins   	花费钻石购买确认提示框

13.编译时请请将 monkeylibs 目录拷贝到项目根目录的上一级目录下