// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20');
// const User = require('../models/schema').user;

// // serialize user for cookie
// passport.serializeUser((user, done) => {
// 	done(null, user.id);
// });

// //deserialize use from request cookie
// passport.deserializeUser((id, done) => {
// 	User.findById(id).then((user) => {
// 		done(null, user);
// 	});
// });

// //configure passport
// passport.use(
// 	new GoogleStrategy(
// 		{
// 			callbackURL: '/auth/google/redirect',
// 			clientID: process.env.CLIENT_ID,
// 			clientSecret: process.env.CLIENT_SECRET,
// 		},
// 		async (accessToken, refreshToken, profile, done) => {
// 			const currentUser = await User.findOne({ googleId: profile.id });

// 			if (currentUser) {
// 				done(null, currentUser);
// 			} else {
// 				const newUser = await new User({
// 					googleId: profile.id,
// 					firstName: profile.name.givenName,
// 					lastName: profile.name.familyName,
// 				}).save();

// 				if (newUser) {
// 					done(null, newUser);
// 				}
// 			}
// 		}
// 	)
// );
