const errorHandler = (err, req, res, next) => {
    console.error("🔥 Error:", err.message);
    res.status(err.statusCode || 500).json({
        statusCode: err.statusCode || 500,
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
    });
};

export default errorHandler;