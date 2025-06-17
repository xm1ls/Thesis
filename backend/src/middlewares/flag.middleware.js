export const setCheckExistenceFlag = (flagValue) => (req, res, next) => {
    req.checkExistenceOnly = flagValue;
    next();
}