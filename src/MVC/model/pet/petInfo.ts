/**
 * 定义普通宠物相关的Reducer
 */
const r_petInfo = FacadeApp.cr({
    // init: false,                  //  初始化标记
    list: {},                       //  宠物列表
    active: 0,                      //  激活的宠物ID
	// _petSet: {},					//  宠物配置信息列表
	PetLevel: 1,       			    //  宠物等级
    FightingPetInfo: null,          //  当前激活宠物信息
    FightingPet: null,              //  当前激活宠物
	// GetPetByID: function(id: number): Pet{ //通过ID获得宠物
    //     return this._petSet[id];
	// },
},{
    [CommandList.M_DAT_PetList](state, {data}){

        if (typeof data != 'undefined' && data != null) {
            state.list = data.items;
            state.active = data.active;
        }

        Object.keys(state.list).map(id=>{
            let petInfo = state.list[id];
            let pet = PetManager.GetPetByID(petInfo.i)
            pet.IsFighting = petInfo.i == state.active;
            pet.IsGet = petInfo.l > 0;

            if(pet.IsFighting){
                state.FightingPetInfo = petInfo;
                state.FightingPet = pet;
            }

            if(petInfo.l > state.PetLevel){
                state.PetLevel = petInfo.l; //所有宠物共有的等级
            }
        });

        return state;
    },
});

