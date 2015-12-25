tabReset = ->
	RocketChat.TabBar.reset()

FlowRouter.route '/admin/users',
	name: 'admin-users'
	triggersEnter: [tabReset]
	triggersExit: [tabReset]
	action: ->
		BlazeLayout.render 'main', {center: 'adminUsers'}


FlowRouter.route '/admin/rooms',
	name: 'admin-rooms'
	triggersEnter: [tabReset]
	triggersExit: [tabReset]
	action: ->
		BlazeLayout.render 'main', {center: 'adminRooms'}


FlowRouter.route '/admin/statistics',
	name: 'admin-statistics'
	triggersEnter: [tabReset]
	triggersExit: [tabReset]
	action: ->
		BlazeLayout.render 'main', {center: 'adminStatistics'}

FlowRouter.route '/admin/import',
	name: 'admin-import'
	triggersEnter: [tabReset]
	triggersExit: [tabReset]
	action: ->
		BlazeLayout.render 'main', {center: 'adminImport'}

FlowRouter.route '/admin/import/prepare/:importer',
	name: 'admin-import-prepare'
	triggersEnter: [tabReset]
	triggersExit: [tabReset]
	action: ->
		BlazeLayout.render 'main', {center: 'adminImportPrepare'}

FlowRouter.route '/admin/import/progress/:importer',
	name: 'admin-import-progress'
	triggersEnter: [tabReset]
	triggersExit: [tabReset]
	action: ->
		BlazeLayout.render 'main', {center: 'adminImportProgress'}

FlowRouter.route '/admin/:group?',
	name: 'admin'
	triggersEnter: [tabReset]
	triggersExit: [tabReset]
	action: ->
		BlazeLayout.render 'main', {center: 'admin'}
