export function equalsArray(a, b) {
    if (a.length !== b.length) {
        return false;
    }

    var seen = {};
    a.forEach(function (v) {
        var key = typeof v + v;
        if (!seen[key]) {
            seen[key] = 0;
        }
        seen[key] += 1;
    });

    return b.every(function (v) {
        var key = typeof v + v;
        if (seen[key]) {
            seen[key] -= 1;
            return true;
        }
    });
}
