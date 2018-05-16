/**
 * 主动技能CD
 */
class SkillCD extends egret.DisplayObjectContainer{
    /**
     * 构造方法
     */
    public constructor(id:number){
        super();

        this._id = id;
        this._movie = new egret.MovieClip();
        this._movie.x = 38;
        this._movie.y = 38;
        MovieManage.GetMovieClipData("jineng_cd_json", "jineng_cd_png", "jineng_sd").then( async (data:egret.MovieClipData) => {
            this._movie.movieClipData = data;
            this._movie.gotoAndStop(1);
            this._image = new eui.Image();
            this._image.width = 44;
            this._image.height = 25;
            this._image.x = 18;
            this._image.y = 18;
            this._image.texture = <egret.Texture> await MovieManage.PromisifyGetRes("jineng_cdlq_png", this);
            this._text = new eui.BitmapLabel();
            this._text.font = "mainnum_fnt";
            this._text.y = 43;
            this._text.width = 200;
            this._text.x = -60;
            this._text.textAlign = egret.HorizontalAlign.CENTER;
            this.Progress = 100;

            this._loaded = true; //加载完成
        });
    }
    
    /**
     * 加载是否完成
     */
    public get loaded(){
        return this._loaded;
    }

    /**
     * 更新技能时间文本
     */
    public Update(){
        if(this.loaded){
            let skill: ActiveSkill = SkillManager.GetActiveSkillByID(this._id);
            if (skill != null){
                var isCool: boolean = (skill.Status == SkillStatusType.Cooldown);
                var text: string = TextManager.TimeFormat(skill.LastTime);
            }
            this.SetContent(text, isCool);
            this.Progress = Math.floor((1 - skill.GetProgress()) * 100);
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
        this._movie.gotoAndStop(Math.min(val + 1, 100));
    }

    /**
     * 设置显示内容
     * @param text      显示时间文本
     * @param isCool    是否冷却
     */
    public async SetContent(text: string, isCool: boolean = false){
        this._text.text = text;
        
        var image: string = isCool? "jineng_cdlq_png" : "jineng_cdsf_png";
        this._image.texture = <egret.Texture> await MovieManage.PromisifyGetRes(image, this);
    }

    /**
     * 是否显示
     */
    private _IsShow(isShow: boolean){
        if (isShow == this._isShow) return;
        this._isShow = isShow;
        if (isShow){
            if (this._movie.parent == null){
                this.addChild(this._movie);
                this.addChild(this._image);
                this.addChild(this._text);
            }
        }
        else{
            if (this._movie.parent != null){
                this.removeChild(this._movie);
                this.removeChild(this._image);
                this.removeChild(this._text);
            }
        }
    }

    // 变量
    private _movie: egret.MovieClip;
    private _image: eui.Image;
    private _text: eui.BitmapLabel;
    private _isShow: boolean = false;
    private _loaded: boolean = false;
    private _id: number = 0;
}