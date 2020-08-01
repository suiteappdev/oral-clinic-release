exports.webpack  = (config)=>{

	Object.assign(config, {
		target: 'electron-renderer',
		devtool: 'cheap-module-source-map',
		plugins: config.plugins.filter(p => p.constructor.name !== 'UglifyJsPlugin')
	});

	config.module.rules.push({
			test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
			use: {
			loader: 'url-loader',
			options: {
				limit: 100000
			}
			}
		}
	);

	return config;
}
  
exports.exportPathMap = () => ({
	'/login': {page: '/login'},
	'/inicio': {page: '/inicio'}
});
