export const config = {
	cors: {
		origin: "*",
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
		allowedHeaders: [
			"Content-Type",
			"Content-Length",
			"Connection",
			"Authorization",
			"Access-Control-Allow-Origin",
			"Access-Control-Allow-Methods",
			"Access-Control-Allow-Headers",
			"Cache-Control",
			"RateLimit-Limit",
			"RateLimit-Remaining",
			"RateLimit-Reset",
			"Retry-After",
			"ETag",
			"Date",
			"Keep-Alive",
		],
	},
};
