

export function statCount(req, res) {
	const {Space, Office, Meetingroom, OfficeOrderView, MeetingroomOrderView, User} = req.app.models;
    Promise.all([
   	            Space.count(), 
   	            Office.count(), 
   	            Meetingroom.count(), 
   	            OfficeOrderView.count(),
   	            MeetingroomOrderView.count(), 
   	            User.count()
   	        ])
            .then(result => {
                const data = {
                	space: result[0], 
                	office: result[1], 
                	meetingroom: result[2], 
                	office_order: result[3],
                	meetingroom_order: result[4],
                	user: result[5]
                };
                res.json({success: true, data: data});
            })
            .catch(err => {
          	    console.log(err);
          	    res.json({success: false, message: '查询失败'});
            })
}