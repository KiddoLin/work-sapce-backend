import { fetchMapStat } from '../controllers/api/qqmap';

class MapStatJob {
	constructor(app, schedule){
		this.app = app;
		this.limit = 1;
		this.offset = 0;
		this.doJob = this.doJob.bind(this);
	}

	doJob(){
		//console.log(this.app);
		const Space = this.app.models.Space;
		const {limit, offset} = this;
		const criteria = {attributes: ['id', 'latitude', 'longitude'], offset: offset, limit: limit};
		criteria.where = {map_stat: null};
		Space.findAll(criteria)
		     .then(spaces =>{
		     	 console.log('######Find ' + spaces.length + ' space records #######');
                 spaces.forEach((space)=>{
                 	this._updateOne(Space, space);
                 })
		     })
		     .catch(err=>{
		     	console.log(err);
		     });
	}
	_updateOne(Space, space){
        const qmapCfg = this.app.config.qqmap;
        fetchMapStat(qmapCfg, {lat: space.latitude, lng: space.longitude}, (err, data) => {
            if(err){
                console.log(err);
                return;
            }
            let map_stat = JSON.stringify(data);
            Space.update({map_stat}, {where: {id: space.id}}).then(()=>{
                console.log('Updated space: id=' + space.id);
            });
        });
	}
}

export default MapStatJob;

