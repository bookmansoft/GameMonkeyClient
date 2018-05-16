/**
 * 主动技能按钮条
 */
class ActiveSkillLine extends eui.Component{
	public constructor(i: number,skillID: number) {
		super();
		this.skinName = "resource/game_skins/ui/ActiveSkillLineSkins.exml";

		this._i = i;
		this._skillId = skillID;
		this._skill = SkillManager.GetActiveSkillByID(this._skillId);

        this._cdMovie = new egret.MovieClip();
        this._cdMovie.x = 38;
        this._cdMovie.y = 38;
        MovieManage.GetMovieClipData("jineng_cd_json", "jineng_cd_png", "jineng_sd").then( async (data:egret.MovieClipData) => {
            this._cdMovie.movieClipData = data;
            this._cdMovie.gotoAndStop(1);
            this._cdImage = new eui.Image();
            this._cdImage.width = 44;
            this._cdImage.height = 25;
            this._cdImage.x = 18;
            this._cdImage.y = 18;
            this._cdImage.texture = <egret.Texture> await MovieManage.PromisifyGetRes("jineng_cdlq_png", this);
            this._cdText = new eui.BitmapLabel();
            this._cdText.font = "mainnum_fnt";
            this._cdText.y = 43;
            this._cdText.width = 200;
            this._cdText.x = -60;
            this._cdText.textAlign = egret.HorizontalAlign.CENTER;
            this.Progress = 100;
            this._isLoadedComplete = true; //加载完成
        });
	}

	/**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();

		this._skillButton.source = this._skill.Status == SkillStatusType.Cooldown ? this._skill.Icon + "_off_png" : this._skill.Icon + "_on_png";
		this.addEventListener(egret.TouchEvent.TOUCH_TAP,this.OnTap,this);
	}

	/**
	 * 点击技能
	 */
	private OnTap(e: egret.TouchEvent){
		if(this._skill.Status == SkillStatusType.Cooldown){
			UIPage.inst(UIPage).ShowConsumeTipWindow().ShowWindow('是否花费10元宝消除所有技能的冷却时间?', ()=>{
				FacadeApp.fetchData([CommandList.M_NET_SkillNum, "&oper=3", "&aid&pm"], [data => {
					if (data["code"] == FacadeApp.SuccessCode){
						SkillManager.UpdateStatus(data["data"]["items"]);
						FacadeApp.dispatchAction(CommandList.M_AT_EFFECTS, data['data']['effects']);//更新效果列表
					}
					else{
						UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
					}
				}]);
			});
		}
		else if(this._skill.Status == SkillStatusType.CanUse){
			FacadeApp.fetchData([CommandList.M_NET_SkillNum, "&oper=2", "&aid=", this._skill.ID, "&pm=1"], [data => {
				if (data["code"] == FacadeApp.SuccessCode){
                    SoundManager.PlaySkillMusic();
                    if(FacadeApp.read(CommandList.Re_Status).guideId == 1) GuideWindow.inst(GuideWindow).GuideFinish(FacadeApp.read(CommandList.Re_Status).guideId);//新手引导第一步
					SkillManager.UpdateStatus(data["data"]["items"]);
					FacadeApp.dispatchAction(CommandList.M_AT_EFFECTS, data['data']['effects']);//更新效果列表
				}
				else{
					UIPage.inst(UIPage).ShowPrompt().ShowWindow(FacadeApp._errorCodeSet[data["code"]]);
				}
			}]);
		}
	}

    /**
     * 更新技能时间文本
     */
    public Update(){
        if(this.loaded){
			let isCool: boolean = (this._skill.Status == SkillStatusType.Cooldown);
			this._skillButton.source = isCool ? this._skill.Icon + "_off_png" : this._skill.Icon + "_on_png";

			let text: string = TextManager.TimeFormat(this._skill.LastTime);
            this.SetContent(text, isCool);
            this.Progress = Math.floor((1 - this._skill.GetProgress()) * 100);
        }
    }

    /**
     * 设置进度
     */
    public set Progress(val: number){
        if (val < 0) return;
        val = Math.round(val);
        if (val >= 100){
            this._IsShow(false);
        }
        else if (val < 100){
            this._IsShow(true);
        }
        this._cdMovie.gotoAndStop(Math.min(val + 1, 100));
    }

    /**
     * 设置显示内容
     * @param text      显示时间文本
     * @param isCool    是否冷却
     */
    public async SetContent(text: string, isCool: boolean = false){
        this._cdText.text = text;
        var image: string = isCool? "jineng_cdlq_png" : "jineng_cdsf_png";
        this._cdImage.texture = <egret.Texture> await MovieManage.PromisifyGetRes(image, this);
    }

    /**
     * 是否显示
     */
    private _IsShow(isShow: boolean){
        if (isShow == this._isShowCD) return;

        this._isShowCD = isShow;
        if (isShow){
            if (this._cdMovie.parent == null){
                this.addChild(this._cdMovie);
                this.addChild(this._cdImage);
                this.addChild(this._cdText);
            }
        }
        else{
            if (this._cdMovie.parent != null){
                this.removeChild(this._cdMovie);
                this.removeChild(this._cdImage);
                this.removeChild(this._cdText);
            }
        }
    }

	/**
     * 加载是否完成
     */
    public get loaded(){
        return this._isLoadedComplete;
    }

	/**
	 * 获取技能
	 */
	public get ID(){
		return this._skillId;
	}

    // 变量
    private _cdMovie: egret.MovieClip;				// cd动画
    private _cdImage: eui.Image;					// cd背景
    private _cdText: eui.BitmapLabel;				// cd文本
    private _isShowCD: boolean = false;				// 是否显示Cd
    private _isLoadedComplete: boolean = false;		// 是否cd动画加载完成

    private _i: number = 0;							// 编号，位置
	private _skill: ActiveSkill;					// 主动技能
	private _skillId: number = 0;					// 技能id
	private _skillButton: eui.Image;				// 技能按钮图片

}