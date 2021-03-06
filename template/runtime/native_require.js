
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/res/res.js",
	"libs/modules/eui/eui.js",
	"libs/modules/tween/tween.js",
	"libs/modules/dragonBones/dragonBones.js",
	"libs/modules/particle/particle.js",
	"libs/modules/physics/physics.js",
	"libs/modules/puremvc/puremvc.js",
	"libs/modules/fsm/fsm.js",
	"libs/modules/socket.io/socket.io.js",
	"libs/modules/redux/redux.js",
	"polyfill/promise.js",
	"bin-debug/Main.js",
	"bin-debug/MVC/controller/CommandList.js",
	"bin-debug/MVC/controller/FacadeApp.js",
	"bin-debug/MVC/view/comm/APanel.js",
	"bin-debug/MVC/view/fight/Soldier.js",
	"bin-debug/MVC/view/pvp/PVPSoldier.js",
	"bin-debug/Utils/Mixins/applyMixins.js",
	"bin-debug/Utils/Mixins/asSettable.js",
	"bin-debug/MVC/view/dailttask/DailyTaskWindowMediator.js",
	"bin-debug/MVC/controller/GameConfigOfRuntime.js",
	"bin-debug/MVC/model/activityInfo.js",
	"bin-debug/MVC/model/Amulet/Amulet.js",
	"bin-debug/MVC/model/Amulet/amuletInfo.js",
	"bin-debug/MVC/model/Amulet/AmuletManager.js",
	"bin-debug/MVC/model/card/Card.js",
	"bin-debug/MVC/model/card/cardInfo.js",
	"bin-debug/MVC/model/card/CardManager.js",
	"bin-debug/MVC/model/card/CardPrototype.js",
	"bin-debug/MVC/model/fight/fightInfo.js",
	"bin-debug/MVC/model/mailInfo.js",
	"bin-debug/MVC/model/pet/Pet.js",
	"bin-debug/MVC/model/pet/petInfo.js",
	"bin-debug/MVC/model/pet/PetManager.js",
	"bin-debug/MVC/model/rank.js",
	"bin-debug/MVC/model/rewardItem/RewardItemManager.js",
	"bin-debug/MVC/model/shop/Goods.js",
	"bin-debug/MVC/model/shop/GoodsManager.js",
	"bin-debug/MVC/model/shop/shopInfo.js",
	"bin-debug/MVC/model/skill/ActiveSkill.js",
	"bin-debug/MVC/model/skill/CardSkill.js",
	"bin-debug/MVC/model/skill/SkillManager.js",
	"bin-debug/MVC/model/skill/TalismanSkill.js",
	"bin-debug/MVC/model/talisman/Talisman.js",
	"bin-debug/MVC/model/talisman/talismanInfo.js",
	"bin-debug/MVC/model/talisman/TalismanManager.js",
	"bin-debug/MVC/model/task/Task.js",
	"bin-debug/MVC/model/task/taskInfo.js",
	"bin-debug/MVC/model/task/TaskManager.js",
	"bin-debug/MVC/model/Unit/Player.js",
	"bin-debug/MVC/model/Unit/status.js",
	"bin-debug/MVC/model/Unit/UnitManager.js",
	"bin-debug/MVC/model/z.js",
	"bin-debug/MVC/view/achievement/AchievementLine.js",
	"bin-debug/MVC/view/achievement/AchievementWindow.js",
	"bin-debug/MVC/view/achievement/AchievementWindowMediator.js",
	"bin-debug/MVC/view/amulet/AmuletDetail.js",
	"bin-debug/MVC/view/amulet/AmuletDetailList.js",
	"bin-debug/MVC/view/amulet/AmuletLine.js",
	"bin-debug/MVC/view/amulet/AmuletPokedexWindow.js",
	"bin-debug/MVC/view/amulet/AmuletWindow.js",
	"bin-debug/MVC/view/amulet/AmuletWindowMediator.js",
	"bin-debug/MVC/view/bg/BG.js",
	"bin-debug/MVC/view/bg/Decoration.js",
	"bin-debug/MVC/view/buddha/BuddhaChange.js",
	"bin-debug/MVC/view/buddha/BuddhaGuard.js",
	"bin-debug/MVC/view/buddha/BuddhaGuardMediator.js",
	"bin-debug/MVC/view/buddha/BuddhaLine.js",
	"bin-debug/MVC/view/buddha/BuddhaManagerMediator.js",
	"bin-debug/MVC/view/buddha/BuddhaManagerWindow.js",
	"bin-debug/MVC/view/card/CardDetail.js",
	"bin-debug/MVC/view/card/CardImage.js",
	"bin-debug/MVC/view/card/CardLine.js",
	"bin-debug/MVC/view/card/CardWindow.js",
	"bin-debug/MVC/view/card/CardWindowMediator.js",
	"bin-debug/MVC/view/comm/ActiveSkillLine.js",
	"bin-debug/AssetAdapter.js",
	"bin-debug/MVC/view/comm/ConsumeTipWindow.js",
	"bin-debug/MVC/view/comm/LabelButton.js",
	"bin-debug/MVC/view/comm/ListBgImage.js",
	"bin-debug/MVC/view/comm/LoadingPage.js",
	"bin-debug/MVC/view/comm/LoginPage.js",
	"bin-debug/MVC/view/comm/OfflineRewardsWindow.js",
	"bin-debug/MVC/view/comm/PassRewardList.js",
	"bin-debug/MVC/view/comm/PassRewardWindow.js",
	"bin-debug/MVC/view/comm/PromptWindow.js",
	"bin-debug/MVC/view/comm/SetWindow.js",
	"bin-debug/MVC/view/comm/SkillLine.js",
	"bin-debug/MVC/view/comm/SkillsTips.js",
	"bin-debug/MVC/view/comm/TrottingHorseLampWindow.js",
	"bin-debug/MVC/view/comm/UIListButton.js",
	"bin-debug/MVC/view/comm/UIPage.js",
	"bin-debug/MVC/view/comm/UIPageMediator.js",
	"bin-debug/MVC/view/comm/WaitPage.js",
	"bin-debug/MVC/view/dailttask/DailyTaskLine.js",
	"bin-debug/MVC/view/dailttask/DailyTaskWindow.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/MVC/view/fight/Army.js",
	"bin-debug/MVC/view/fight/EventHandler.js",
	"bin-debug/MVC/view/fight/FightConfig.js",
	"bin-debug/MVC/view/fight/FightManager.js",
	"bin-debug/MVC/view/fight/LifeNumber.js",
	"bin-debug/MVC/view/fight/MonsterLifeBar.js",
	"bin-debug/MVC/view/fight/MonsterSoldier.js",
	"bin-debug/MVC/view/fight/PetSoldier.js",
	"bin-debug/MVC/view/fight/RoleSoldier.js",
	"bin-debug/MVC/controller/ConfigStaticManager.js",
	"bin-debug/MVC/view/fight/SoldierFactory.js",
	"bin-debug/MVC/view/Guide/GuideHand.js",
	"bin-debug/MVC/view/Guide/GuideWindow.js",
	"bin-debug/MVC/view/Integral/IntegralExchangeList.js",
	"bin-debug/MVC/view/Integral/IntegralRankList.js",
	"bin-debug/MVC/view/Integral/IntegralRuleWindow.js",
	"bin-debug/MVC/view/Integral/IntegralWindow.js",
	"bin-debug/MVC/view/Integral/IntegralWindowMediator.js",
	"bin-debug/MVC/view/mail/MailDetailWindow.js",
	"bin-debug/MVC/view/mail/MailLine.js",
	"bin-debug/MVC/view/mail/MailWindow.js",
	"bin-debug/MVC/view/mail/MailWindowMediator.js",
	"bin-debug/MVC/view/marshalling/MarshallingLine.js",
	"bin-debug/MVC/view/marshalling/MarshallingWindow.js",
	"bin-debug/MVC/view/marshalling/MarshallingWindowMediator.js",
	"bin-debug/MVC/view/pet/PetCurOutList.js",
	"bin-debug/MVC/view/pet/PetDetail.js",
	"bin-debug/MVC/view/pet/PetGeniusLine.js",
	"bin-debug/MVC/view/pet/PetLine.js",
	"bin-debug/MVC/view/pet/PetWindow.js",
	"bin-debug/MVC/view/pet/PetWindowMediator.js",
	"bin-debug/MVC/view/pvp/PVPArmy.js",
	"bin-debug/MVC/view/pvp/PVPEndWindow.js",
	"bin-debug/MVC/view/pvp/PVPFightDataConfig.js",
	"bin-debug/MVC/view/pvp/PVPFightManager.js",
	"bin-debug/MVC/view/pvp/PVPNum.js",
	"bin-debug/MVC/view/pvp/PVPRole.js",
	"bin-debug/MVC/view/pvp/PVPRoleLife.js",
	"bin-debug/MVC/view/pvp/PVPRolePhysics.js",
	"bin-debug/MVC/view/pvp/PVPSkillArmatureManager.js",
	"bin-debug/MVC/controller/ControllerPrepCommand.js",
	"bin-debug/MVC/view/pvp/PVPSoldierFactory.js",
	"bin-debug/MVC/view/pvp/PVPVSWindow.js",
	"bin-debug/MVC/view/pvp/PVPWindow.js",
	"bin-debug/MVC/view/pvp/PVPWindowMediator.js",
	"bin-debug/MVC/view/rank/RankingWindow.js",
	"bin-debug/MVC/view/rank/RankingWindowMediator.js",
	"bin-debug/MVC/view/rank/RankList.js",
	"bin-debug/MVC/view/revive/HangUpGetWindow.js",
	"bin-debug/MVC/view/revive/HangUpingWindow.js",
	"bin-debug/MVC/view/revive/HangUpTipWindow.js",
	"bin-debug/MVC/view/revive/ReviveTipsWindow.js",
	"bin-debug/MVC/view/revive/SeniorReviveWindow.js",
	"bin-debug/MVC/view/revive/ZSLine.js",
	"bin-debug/MVC/view/revive/ZSWindow.js",
	"bin-debug/MVC/view/sanjie/SanjieAniManage.js",
	"bin-debug/MVC/view/sanjie/SanjieCard.js",
	"bin-debug/MVC/view/sanjie/SanJieFuWindow.js",
	"bin-debug/MVC/view/shop/ShopGoodsLine.js",
	"bin-debug/MVC/view/shop/ShopWindow.js",
	"bin-debug/MVC/view/shop/ShopWindowMediator.js",
	"bin-debug/MVC/view/skill/Skillcd.js",
	"bin-debug/MVC/view/talisman/TalismanDetail.js",
	"bin-debug/MVC/view/talisman/TalismanDetailList.js",
	"bin-debug/MVC/view/talisman/TalismanLine.js",
	"bin-debug/MVC/view/talisman/TalismanWindow.js",
	"bin-debug/MVC/view/talisman/TalismanWindowMediator.js",
	"bin-debug/MVC/view/z.js",
	"bin-debug/ThemeAdapter.js",
	"bin-debug/Utils/CalculateMgr.js",
	"bin-debug/Utils/Digit.js",
	"bin-debug/Utils/FilterManage.js",
	"bin-debug/Utils/Indicate.js",
	"bin-debug/MainMediator.js",
	"bin-debug/MVC/controller/GameCommand.js",
	"bin-debug/Utils/MovieManage.js",
	"bin-debug/Utils/ObjectPool.js",
	"bin-debug/Utils/physics.js",
	"bin-debug/Utils/RewardType.js",
	"bin-debug/Utils/SoundManager.js",
	"bin-debug/Utils/TextManager.js",
	"bin-debug/Utils/TimeFormator.js",
	"bin-debug/Utils/Toast.js",
	"bin-debug/z.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    if(egret_native.featureEnable) {
        //控制一些优化方案是否开启
        var result = egret_native.featureEnable({
            
        });
    }
    egret_native.requireFiles();
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "showAll",
		contentWidth: 640,
		contentHeight: 1136,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel("/system/fonts/DroidSansFallback.ttf", 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};