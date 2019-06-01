import passport from 'passport';

export function login(req, res, next){
    
  let username = req.body.username;
  let password = req.body.password;

  if(!username || username==='') {
    res.json({success: false, message: '用户名不能为空!'});
    return;
  }

  if(!password || password==='') {
    res.json({success: false, message: '密码不能为空!'});
    return;
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
        return next(err);
    }
    if (!user) {
        return res.json(info);//登陆失败
    }
    
    //clean password filed for security reason
    user.password = undefined; 
    //save logon user data in session
    req.login(user, function(err) {
        if (err) {
            return next(err);
        }
        // //login successfully
        // user.lastLogin = Date.now();
        // //update last login field to db
        // User.update({ email: username }, {lastLogin: user.lastLogin}, (err)=>{
        //     if(err)
        //       console.log(err);
        // });
        return res.json({ success: true, item: user });
    });
  })(req, res, next);
}

export function logout(req, res, next){
    req.logout();
    res.json({'success':true});
}

export function current(req, res, next){
	console.log(req.session.passport);
    let user = req.session.passport.user;
    if(!user)
      res.json({success: false, message: '用户未登陆或登陆已经过期'});

    res.json({success: true, user: user});
}