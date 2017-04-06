import Mentions from './mentions';
const MentionsClient = new Mentions({
	pattern() {
		return RocketChat.settings.get('UTF8_Names_Validation');
	},
	me() {
		const me = Meteor.user();
		return me && me.username;
	}
});
RocketChat.callbacks.add('renderMessage', (message) => MentionsClient.parse(message), RocketChat.callbacks.priority.MEDIUM, 'mentions-message');
RocketChat.callbacks.add('renderMentions', (message) => MentionsClient.parse(message), RocketChat.callbacks.priority.MEDIUM, 'mentions-mentions');
