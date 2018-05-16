/**
 * 排行榜界面
 */
class RankingWindow extends APanel{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/ui/RankingWindowSkins.exml");
        FacadeApp.inst.removeMediator(ViewerName.RankingWindowMediator); 
        FacadeApp.inst.registerMediator(new RankingWindowMediator(this)); 
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
        this._guanqiaButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnGuanQiaClick, this);
        this._jingjiButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnJingJiClick, this);
        this._gonghuiButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnGongHuiClick, this);
        this._SetFilter();
        this._rank1Chance = true; 
        this._rank2Chance = true;       
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        FacadeApp.Notify(CommandList.M_CMD_UIOPENED_RANK_Tab1);
    }

    /**
     * 刷新
     */
    public async Render(){
        super.Render();

        this._guanqiaButton.selected = this._pageNum == 0 ? true : false;
        this._jingjiButton.selected = this._pageNum == 1 ? true : false;
        this._gonghuiButton.selected = this._pageNum == 2 ? true : false;

        // 移除全部排行行
        if(this._rankArr.length > 0){
            for(var i:number=0; i<this._rankArr.length; i++){
                this._rankGroup.removeChild(this._rankArr[i]);
            }
        }
        this._rankArr = [];
        let myRank = FacadeApp.read(CommandList.Re_RankInfo);
        // 获取排行数据
        switch(this._pageNum){
            case 0:
                this._rankDate = FacadeApp.read(CommandList.Re_RankInfo).list1;
                this._pmNumLabel.text = myRank.rank1.toString();
                if(myRank.rank1 != 0 && myRank.rank1 <= 100 && this._rank1Chance){
                    UIPage.inst(UIPage).ShowPrompt().ShowWindow("恭喜您进入关卡榜前100名！",null,null,false,null,null ,true);
                    this._rank1Chance = false;
                }
                break;
            case 1:
                this._rankDate = FacadeApp.read(CommandList.Re_RankInfo).list2.length > 0 ? FacadeApp.read(CommandList.Re_RankInfo).list2:FacadeApp.read(CommandList.Re_RankInfo).list1;
                this._pmNumLabel.text = myRank.rank2.toString();
                if(myRank.rank2 != 0 && myRank.rank2 <= 100 && this._rank2Chance){
                    UIPage.inst(UIPage).ShowPrompt().ShowWindow("恭喜您进入竞技榜前100名！",null,null,false,null,null ,true);
                    this._rank2Chance = false;
                }
                break;
            case 2:
                this._rankDate = FacadeApp.read(CommandList.Re_RankInfo).list3;
                this._pmNumLabel.text = FacadeApp.read(CommandList.Re_RankInfo).rank3.toString();
                break;
        }

        // 创建排行行
        var lineHeight: number = 0;
        for (var index in this._rankDate){
            var itemObject = this._rankDate[index];
            var _rank:RankList = new RankList();
            this._rankGroup.addChild(_rank);
            _rank.y=lineHeight;
            lineHeight += _rank.height;
            this._rankArr.push(_rank);
            _rank.SetShow(itemObject,this._pageNum);
        }

        this.setScrollBar();
    }
    
    /**
     * 设置文本文字效果
     */
    private _SetFilter(){
        // this._timeLabel.filters = [FilterManage.AddMiaoBian(1,0x000000)];
        // this._pmNumLabel.filters = [FilterManage.AddMiaoBian(1,0x916905)];
        // this._wodepaimingLabel.filters = [FilterManage.AddMiaoBian(1,0x916905)];
        // this._wenziLabel.filters = [FilterManage.AddMiaoBian(1,0x000000)];
    }

    /**
     * 关闭点击响应
     */
    private _OnCloseClick(event: egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        this.UnRegister();
    }

    /**
     * 关卡榜点击响应
     */
    private _OnGuanQiaClick(event: egret.TouchEvent){
        SoundManager.PlayButtonMusic();
        FacadeApp.Notify(CommandList.M_CMD_UIOPENED_RANK_Tab1);
    }

    /**
     * 竞技榜点击响应
     */
    private _OnJingJiClick(event: egret.TouchEvent){
        SoundManager.PlayButtonMusic();
        FacadeApp.Notify(CommandList.M_CMD_UIOPENED_RANK_Tab2);
    }

    /**
     * 公会榜点击响应
     */
    private _OnGongHuiClick(event: egret.TouchEvent){
        SoundManager.PlayButtonMusic();
        FacadeApp.Notify(CommandList.M_CMD_UIOPENED_RANK_Tab3);
    }

    /**
     * 滚动条设置，初始化
     */
    private setScrollBar(){
        this._rankList.stopAnimation();
        this._rankList.viewport.scrollV=0;

        this._rankList.bounces=false;
        this._rankList.verticalScrollBar.autoVisibility = false;
        this._rankList.verticalScrollBar.visible = false;
    }

    // 变量
    private _closeButton: eui.Button;                   // 关闭按钮
    private _jingjiButton: eui.RadioButton;             // 竞技按钮
    private _gonghuiButton: eui.RadioButton;            // 公会按钮
    private _guanqiaButton: eui.RadioButton;            // 关卡按钮
    private _timeLabel:eui.Label;                       // 时间
    private _pmNumLabel:eui.Label;                      // 排名
    private _wodepaimingLabel:eui.Label;                // 文字：我的排名
    private _wenziLabel:eui.Label;                      // 文字

    private _rankList : eui.Scroller;                   // 物品列表
    private _rankGroup : eui.Group;                     // 滚动容器
    private _rankingList: RankList;                     // 排行榜列表
    private _rankArr:any[]=[];                          // 存储排行行
    private _rankDate:any[]=[];                         // 存储排行榜数据
    public _pageNum:number = 0;                          // 当前页面编号 0 关卡 1 竞技 2 公会
    private _rank1Chance:boolean;
    private _rank2Chance:boolean;
}