class GuideWindow extends APanel{
    /**
     * 构造方法
     */
    public constructor(){
        super("resource/game_skins/GuidePageSkins.exml");
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
    }

    /**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
    }


    // /**
    //  * 点击知道按钮
    //  */
    // private _OnKnowClick(){
    //     SoundManager.PlayButtonMusic();
    //     this.GuideFinish(FacadeApp.read(CommandList.Re_Status).guideId);
    // }
    /**
     * 显示新手引导对话框
     */
    public Show(type: number){
        this._shang.visible = false; //朝上箭头的对话框
        this._xia.visible = false;   //朝下
        this._zuo.visible = false;   //朝左
        this._you.visible = false;   //朝右
        this._group.visible = true;
        let tw = egret.Tween.get(this._group);
        switch(type){//新手引导进度，数据由服务端处理保存，目前设定3步，0为已完成
            case 1:{// 角色信息
                this._guideInfo.text = "此处6个为主动技能长按查看详情,点击释放";
                this._group.x = 170;
                this._group.y = 710;
                this._xia.visible = true;
                tw.to({scaleX:1.1,scaleY:1.1},1000)
                .to({scaleX:1,scaleY:1},1000)
                .to({scaleX:1.1,scaleY:1.1},1000)
                .to({scaleX:1,scaleY:1},1000)
                .to({scaleX:1.1,scaleY:1.1},1000)
                .to({scaleX:1,scaleY:1},1000)
                .to({scaleX:1.1,scaleY:1.1},1000)
                .to({scaleX:1,scaleY:1},1000);
            }
            break;
            case 2:{
                this._guideInfo.text = "升级法宝、宠物、符咒以及神魔可以更快的过关哦！";
                this._group.x = 150;
                this._group.y = 800;
                this._xia.visible = true;
                tw.to({scaleX:1.1,scaleY:1.1},1000)
                .to({scaleX:1,scaleY:1},1000)
                .to({scaleX:1.1,scaleY:1.1},1000)
                .to({scaleX:1,scaleY:1},1000)
                .to({scaleX:1.1,scaleY:1.1},1000)
                .to({scaleX:1,scaleY:1},1000)
                .to({scaleX:1.1,scaleY:1.1},1000)
                .to({scaleX:1,scaleY:1},1000);
            }
            break;
            case 3:{
                this._guideInfo.text = "三界符抽奖可获得大量卡牌碎片，合成卡牌增加PVP战斗力哦！每日更有3次免费抽取机会";
                this._group.x = 70;
                this._group.y = 300;
                this._zuo.visible = true;
                tw.to({scaleX:1.1,scaleY:1.1},1000)
                .to({scaleX:1,scaleY:1},1000)
                .to({scaleX:1.1,scaleY:1.1},1000)
                .to({scaleX:1,scaleY:1},1000)
                .to({scaleX:1.1,scaleY:1.1},1000)
                .to({scaleX:1,scaleY:1},1000)
                .to({scaleX:1.1,scaleY:1.1},1000)
                .to({scaleX:1,scaleY:1},1000);
            }
            break;
            case 0:UIPage.inst(UIPage).ShowGuideWindow().UnRegister();
            break;
            default:
            break;
        }
        egret.setTimeout(()=>{
            this._group.visible = false;
        }, this, 8000);
    }  
    /**
     * 引导检测
     */
    private GuideCheck(){
        this.Show(FacadeApp.read(CommandList.Re_Status).guideId);
        if(FacadeApp.read(CommandList.Re_Status).guideId == 0) {
            let temp = FacadeApp.read(CommandList.Re_Status).diamond;
            FacadeApp.fetchData([CommandList.M_NET_STATUS], [data=>{ //更新玩家状态
                if (data["code"] == FacadeApp.SuccessCode){
                    FacadeApp.dispatchAction(CommandList.M_AT_STATUSLIST, data['data']);
                    let text = "恭喜您完成了新手引导，获得元宝：100";
                    if(FacadeApp.read(CommandList.Re_Status).diamond -temp > 0)UIPage.inst(UIPage).ShowPrompt().ShowWindow(text);
                }
            }]);
        }
        
    }

    /**
     * 引导结束
     */
    private GuideFinish(guideID: number = 0){
        if (guideID != 0 && guideID != FacadeApp.read(CommandList.Re_Status).guideId) return;
        FacadeApp.fetchData([CommandList.M_NET_CheckpointNum, "&oper=12","&gid=" + FacadeApp.read(CommandList.Re_Status).guideId],[data=>{
            FacadeApp.dispatchAction(CommandList.M_AT_GUIDE, data['data']);
            this.GuideCheck();
        }]);
        
    }


    // 变量
    private _guideInfo: eui.Label;
    private _shang:eui.Image;
    private _xia:eui.Image;
    private _zuo:eui.Image;
    private _you:eui.Image;
    private _group:eui.Group;
}