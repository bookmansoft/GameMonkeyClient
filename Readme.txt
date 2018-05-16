系统主要目录：
    modules：放置引入的第三方库，经编译后自动进入libs/modules
    resource：美术资源、皮肤、配置文件
    src/boot：启动相关
		Main.ts															// 主入口
		AssetAdapter.ts													// 解析器
		ThemeAdapter.ts													// 皮肤解析器
    src/config：配置管理
    src/MVC：采用MVC模型进行业务管理
    src/Utils：常用例程。
    src/Utils/Mixins：可组合的通用类
    业务模块：
		amulet
				Amulet.ts												// 符咒
				AmuletManager.ts										// 符咒管理
		bg
				BG.ts													// 背景
				Decoration.ts											// 近景
		digit
				CalculateMgr.ts											// 计算管理
				Digit.ts												// 数字
		fight
				monster
						BossTimeManage.ts								// boss时间管理
						LifeNumber.ts									// 血量数值
						Monster.ts										// 怪物
						MonsterLifeBar.ts								// 怪物血条
						MonsterManage.ts								// 怪物管理
				role
						Role.ts											// 猴子角色
				FightData.ts											// 战斗数据
				FightManage.ts											// 战斗管理
		ghost
				Ghost.ts												// 神魔
				GhostManager.ts											// 神魔管理
				GhostPrototype.ts										// 神魔原型
				SanjieAniManage.ts									    // 三界符动画管理
				SanjieGhost.ts											// 三界符出现的神魔
		item
				Item.ts													// 物品
				ItemManager.ts											// 物品管理
		net
				NetFunctionCode.ts									    // 消息功能编号
				NetManager.ts											// 网络管理器
				NetNumber.ts											// 消息编号
		page
				LoadingPage.ts											// 加载界面
				LoginPage.ts											// 登录界面
		shop
				Goods.ts												// 商品
				GoodsShop.ts											// 商店
				ShopManager.ts											// 商店管理
		skill
				ActiveSkill.ts											// 主动技能
				ItemSkill.ts											// 物品技能
				Skillcd.ts												// 主动技能CD
				SkillManager.ts											// 技能管理
		task 
				DailyTask.ts											// 每日任务
				TaskManager.ts											// 任务管理
		tool
				DataManage.ts											// 数据管理
				DataType.ts												// 数据类型
				FilterManage.ts											// 渲染管理
				MovieManage.ts											// 动画数据管理
				RewardType.ts											// 奖励类型管理
				SoundManager.ts											// 音频管理
				TextManager.ts											// 文本管理
		ui
				amulet
						AmuletDetail.ts									// 符咒详细界面
						AmuletDetailList.ts							    // 符咒召唤行
						AmuletList.ts									// 符咒行
						AmuletPokedexWindow.ts					        // 符咒界面
						AmuletWindow.ts									// 符咒界面
				dailttask
						DailyTaskLine.ts								// 每日任务行
						DailyTaskWindwo.ts							    // 每日任务界面
				ghost
						GhostDetail.ts									// 神魔详细信息
						GhostImage.ts									// 神魔图片
						GhostList.ts									// 神魔行
						GhostWindow.ts									// 神魔界面
				item
						ItemDetail.ts									// 物品详细界面
						ItemList.ts										// 物品行
						ItemWindow.ts									// 物品界面
				pet
						CZPetList.ts									// 战斗宠物行
						PetDetail.ts									// 宠物详细信息界面
						PetList.ts										// 宠物行
						PetWindow.ts									// 物品界面
						ZSlist.ts										// 转生行
				rank
						RankingWindow.ts								// 排行榜界面
						Ranklist.ts										// 排行榜行
				shop
						ShopGoodsLine.ts								// 商品行
						ShoWindow.ts									// 物品界面
				APanel.ts												// 界面基类
				PromptWindow.ts											// 提示弹框
				SanjieFuWindown.ts									    // 三界符界面
				SetWindow.ts											// 设置界面
				UIPage.ts												// UI界面(主界面)
				ZSWindow.ts												// 转生界面
		unit
				Pet.ts													// 宠物
				Player.ts												// 玩家
				UnitManager.ts											// 角色管理器

pureMVC系统要解决的问题：
1、解耦：通过事件订阅和事件通知，降低模块间的耦合
2、单向数据流：View到Command到Model再反馈回View，一定要坚持这个单向、闭环的数据流，业务逻辑才清晰可控
3、统一的数据仓库
4、基于状态失效模式的View刷新机制，并且状态也可以统一到数据仓库中

当前系统对pureMVC做了适当调整：
1、Model部分使用了Action/Reducer模式进行了替换；
2、Viewer部分，使用了XXX.ts + XXXMediator.ts组合模式，前者负责完成EXML的实例化，后者负责界面操作反馈、逻辑处理、数据刷新等。

当前系统内的消息机制包括：
1、发送网络请求：调用NetManager.SendRequest，向服务端请求数据，返回的数据自动注入回调函数内处理
2、发送通知：调用AppFacade.Notify，在pureMVC框架内发送、处理通知
3、发送数据仓库修改指令：调用AppFacade.dispatchAction，修改数据仓库内的数据项，同时出发数据仓库变更通知
4、发送普通事件：调用AppFacade.fire，发送普通事件，可携带自定义数据结构