/**
 * 三界符界面
 */
class SanJieFuWindow extends APanel{
    /**
     * 构造方法
     */
    public constructor() {
        super("resource/game_skins/ui/SanjiefuWindowSkins.exml");
    }

    /**
     * 素材加载完毕时自动调用
     */
    public ComponentWillMount(){
        this._closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnCloseClick, this);
		this._kuitanButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnKuitanClick, this);
		this._wuxingButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnWuxingClick, this);
        
        this._yinyangIma.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnWuxingClick, this);
		this._qiankunIma.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnKuitanClick, this);
		
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnAniEnd, this);
        this._CreateArmature();
        this._Render();
    }

    /**
     * 被添加到舞台时自动调用
     * 注：目前的机制并不能保证ComponentWillMount先于ComponentDidMount被调用
     */
    public ComponentDidMount(){
        if(FacadeApp.read(CommandList.Re_Status).guideId == 3) GuideWindow.inst(GuideWindow).GuideFinish(FacadeApp.read(CommandList.Re_Status).guideId);//新手引导第3步
    }

    /**
     * 关闭按钮响应
     */
    private _OnCloseClick(event : egret.TouchEvent){
        SoundManager.PlayCloseWinMusic();
        if(this._aniPage.GetState() == null){
            this.UnRegister();
        }
    }

    /**
     * 动画结束点击响应
     */
    private _OnAniEnd(event : egret.TouchEvent){
        if(this._aniPage.GetState() == "end"){
            this._aniPage.AniEnd();
            this._aniPage.SetState(null);
        }
    }

    /**
     * 五行召唤按钮响应
     */
    private _OnWuxingClick(event : egret.TouchEvent){
        SoundManager.PlayButtonMusic();

        // FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=5&pm=10&id"], [data=>{
        //     FacadeApp.dispatchAction(CommandList.M_DAT_CardList, data['data']);
        //     this._Render();
        //     if(data["code"] != FacadeApp.SuccessCode){
        //         UIPage.inst(UIPage).ShowPrompt().ShowWindow(data["code"]+":"+FacadeApp._errorCodeSet[data["code"]]);
        //         return;                
        //     } 
        //     if(this._aniPage.GetState() == null){
        //         this._aniPage.PlayAni(1);
        //     }
        // }]);
        let tem = null;
        let cur = null;
        FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=1"], [data => {
            if(data[`code`]!=FacadeApp.SuccessCode){
                UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                return;
            }
            tem = data['data'];            
            FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=5"], [data=>{
                if(data["code"] != FacadeApp.SuccessCode){
                    UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                    return;
                }
                this._Render();                
                FacadeApp.dispatchAction(CommandList.M_DAT_CardList, data['data']);
                cur = data['data'];
                let arr = []; 
                for(let $key in cur.items){
                    if(cur.items[$key].p - tem.items[$key].p > 0){
                        arr.push({id: cur.items[$key].i, p:cur.items[$key].p - tem.items[$key].p});
                    }
                }     
                if(this._aniPage.GetState() == null){
                    this._aniPage.PlayAni(1,arr,cur.adChip-tem.adChip,cur.chip -tem.chip);
                }
            }]);
            //将网络数据保存到数据仓库，自动触发数据更新
            FacadeApp.dispatchAction(CommandList.M_DAT_CardList, data['data']);
            FacadeApp.fetchData([CommandList.M_NET_STATUS], [data=>{
                FacadeApp.dispatchAction(CommandList.M_AT_STATUSLIST, data['data']);
                if(data["code"] != FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
            }]);
        }]);
    }

    /**
     * 窥探天机按钮响应
     */
    private _OnKuitanClick(event : egret.TouchEvent){
        SoundManager.PlayButtonMusic();
        let tem = null;
        let cur = null;
        FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=1"], [temp => {
            if(temp[`code`]!=FacadeApp.SuccessCode){
                UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[temp["code"]]);
                return;
            }
            //将网络数据保存到数据仓库，自动触发数据更新
            FacadeApp.dispatchAction(CommandList.M_DAT_CardList, temp['data']);
            tem = temp['data'];        
            FacadeApp.fetchData([CommandList.M_NET_Card, "&oper=11"], [data=>{
                if(data["code"] != FacadeApp.SuccessCode){
                    UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                    return;
                }
                FacadeApp.dispatchAction(CommandList.M_DAT_CardList, data['data']);
                cur = data['data'];
                let arr = []; 
                for(let $key in cur.items){
                    if(cur.items[$key].p - tem.items[$key].p > 0){
                        arr.push({id: cur.items[$key].i, p:cur.items[$key].p - tem.items[$key].p});
                    }
                }       
                if(this._aniPage.GetState() == null){
                    this._aniPage.PlayAni(2,arr,cur.adChip-tem.adChip,cur.chip -tem.chip);
                }
                FacadeApp.fetchData([CommandList.M_NET_STATUS], [data=>{
                    FacadeApp.dispatchAction(CommandList.M_AT_STATUSLIST, data['data']);
                    if(data["code"] != FacadeApp.SuccessCode) UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
                }]);
            }]);
            
        }]);
        
    }
    
    /**
	 * 创建动画类
	 */
	private _CreateArmature(): void {
        this._aniPage = new SanjieAniManage();
        this.addChild(this._aniPage);
	}
    private _Render(){
        let max = FacadeApp.read(CommandList.Re_Status).execute[`max`][`101`]?FacadeApp.read(CommandList.Re_Status).execute[`max`][`101`][`num`]:3;
        let num = FacadeApp.read(CommandList.Re_Status).execute[`num`][`101`]?FacadeApp.read(CommandList.Re_Status).execute[`num`][`101`]:0;        
        this._freeChance.text = `${max-num}/${max}`;
        
    }

    // 变量
    private _closeButton : eui.Button;                  // 关闭按钮
    private _kuitanButton : eui.Button;                 // 窥探天机按钮
	private _wuxingButton : eui.Button;                 // 五行召唤按钮
	private _qiankunIma : eui.Image;            	    // 乾坤符
	private _yinyangIma : eui.Image;                    // 阴阳符
    private _curClickNum:number=0;                       // 当前是哪种动画 1 五行召唤 2 窥探天机按钮
    private _aniPage:SanjieAniManage;                    // 三界符动画
    private _freeChance:eui.BitmapLabel;                      //免费次数
}