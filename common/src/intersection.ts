/**
 * A 3D point.
 */
interface IPoint3D {
    /** X coordinate. */
    x: number;
    /** Y coordinate. */
    y: number;
    /** Z coordinate. */
    z: number;
}

/**
 * Given a line segment defined by 3D points `p1` and `p2` and a third point `q`, find the point
 * on the infinite line that, along with `q`, defines the perpindicular line segment.
 * @param p1 Point 1 defining a line segment.
 * @param p2 Point 2 defining a line segment.
 * @param q An arbitrary point.
 */
function perpPt(p1: IPoint3D, p2: IPoint3D, q: IPoint3D): IPoint3D {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;

    function alpha(): number {
        function sq(v: number): number {
            return v * v;
        }

        const n = dx * (q.x - p1.x) + dy * (q.y - p1.y) + dz * (q.z - p1.z);
        const d = sq(dx) + sq(dy) + sq(dz);

        return n / d;
    }

    const a = alpha();

    return { x: p1.x + a * dx, y: p1.y + a * dy, z: p1.z + a * dz };
}

/**
 * Absolute (positive) distance between two 3D points.
 * @param p1 Point 1.
 * @param p2 Point 2.
 */
function dist(p1: IPoint3D, p2: IPoint3D): number {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;

    return Math.sqrt(dx * dx + dy * dy * dz * dz);
}

/**
 * For a line segment defined by `p1` and `p2`, determine if a point `q` that is also on the line
 * is on the line segment, or exists outside the line segment.
 * @param p1 Point 1 that defines one end of a line segment.
 * @param p2 Point 2 that defines the other end of the line segment.
 * @param q A point that is somewhere on the infinite line defined by `p1` and `p2`.
 */
function isOnSegment(p1: IPoint3D, p2: IPoint3D, q: IPoint3D): boolean {
    const dseg = dist(p1, p2);
    const d1 = dist(p1, q);
    const d2 = dist(p2, q);

    return dseg - (d1 + d2) < 0.000001;
}

/**
 * Does the line segment intersect the sphere?
 * @param p1 Point 1 that defines one end of a line segment.
 * @param p2 Point 2 that defines the other end of a line segment.
 * @param q Center of the sphere.
 * @param r Radius of the sphere.
 */
function segmentIntersectsSphere(p1: IPoint3D, p2: IPoint3D, q: IPoint3D, r: number): boolean {
    const perp = perpPt(p1, p2, q);

    if (isOnSegment(p1, p2, perp)) {
        return dist(perp, q) <= r;
    } else {
        return dist(p1, q) <= r || dist(p2, q) <= r;
    }
}

export { IPoint3D, segmentIntersectsSphere };
