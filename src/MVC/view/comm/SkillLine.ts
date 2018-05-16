/**
 * 技能图标，宠物。法宝
 */
class SkillLine extends eui.Component{
    /**
     * 构造方法
     */
    public constructor() {
        super();
        this.skinName = "resource/game_skins/comm/SkillLineSkins.exml";
    }

    /**
     * 子项创建完成
     */
    protected createChildren() {
        super.createChildren();
    }


    /**
     * 法宝技能更新
     * lev 技能等级
     * talisman 法宝
     */
    public updataTalismanShow($level,$skillId,_talisman:Talisman){
        this.obj = _talisman;

        this.requireLevel = $level;

        this.sObj = SkillManager.GetTalismanSkillByID($skillId);

        if(this.sObj == null) return;

        this._mengbanIma.alpha = this.obj.Level >= this.requireLevel ? 0 : 1;
        this._suoIma.alpha = this.obj.Level >= this.requireLevel ? 0 : 1;
        this._lvLabel.alpha = this.obj.Level >= this.requireLevel ? 0 : 1;
        this._levelNumLabel.alpha = this.obj.Level >= this.requireLevel ? 0 : 1;

        // let res = this.sObj.Icon + "_png";
        this._skillIma.source = this.sObj.Icon + "_png";
        // if(this._mengbanIma.alpha){
        //     this._skillIma.filters = [];
        // }
        // RES.getResAsync(res, icon =>{
        //     this._skillIma.texture = icon;
        //     if(this._mengbanIma.alpha){
        //         this._skillIma.filters = [];
        //     }
        // },this);

        this._levelNumLabel.text = this.requireLevel.toString();
    }

    /**
     * 宠物技能更新
     * lev 技能等级
     * pet 宠物
     */
    public updataPetShow($level,$skillId,_pet:Pet){
        this.obj = _pet;

        this.requireLevel = $level;
        this.sObj = SkillManager.GetTalismanSkillByID($skillId);

        // RES.getResAsync(this.sObj.Icon + "_png", icon =>{ 
        this._skillIma.source = this.sObj.Icon + "_png";
        // },this);

        this._mengbanIma.alpha = this.obj.Level >= this.requireLevel ? 0 : 1;
        this._suoIma.alpha = this.obj.Level >= this.requireLevel ? 0 : 1;
        this._lvLabel.alpha = this.obj.Level >= this.requireLevel ? 0 : 1;
        this._levelNumLabel.alpha = this.obj.Level >= this.requireLevel ? 0 : 1;

        this._levelNumLabel.text = this.requireLevel.toString();
    }

    private _skillIma: eui.Image;               // 技能图标
    private _lvLabel: eui.Label;                    // lv
    private _levelNumLabel: eui.Label;              // 技能
    private _suoIma: eui.Image;                     // 锁
    private _mengbanIma: eui.Image;                 // 蒙版

    /**
     * 解锁等级
     */
    private requireLevel:number = 0;
    private sObj:TalismanSkill = null;
    private obj:any = null;

}