const commonFunc = {
    addSTTForList: (arr, start) => {
        if (!arr) return [];
        return arr.map((ele, index) => ({
            key: index,
            stt: index + 1 + start,
            ...ele,
        }));
    },
};

export default commonFunc;
