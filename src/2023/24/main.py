import sympy as sym

# x1=19
# y1=13
# z1=30
# vx1=-2
# vy1=1
# vz1=-2

# x2=18
# y2=19
# z2=22
# vx2=-1
# vy2=-1
# vz2=-2

# x3=20
# y3=25
# z3=34
# vx3=-2
# vy3=-2
# vz3=-4

#################

x1 = 176253337504656
y1 = 321166281702430
z1 = 134367602892386
vx1 = 190
vy1 = 8
vz1 = 338

x2 = 230532038994496
y2 = 112919194224200
z2 = 73640306314241
vx2 = 98
vy2 = 303
vz2 = 398

x3 = 326610633825237
y3 = 321507930209081
z3 = 325769499763335
vx3 = -67
vy3 = -119
vz3 = -75

xk, yk, zk, vxk, vyk, vzk, t1, t2, t3 = sym.symbols(
    "xk, yk, zk, vxk, vyk, vzk, t1, t2, t3"
)


result = sym.solve(
    [
        sym.Eq(xk + t1 * vxk - x1 - vx1 * t1, 0),
        sym.Eq(yk + t1 * vyk - y1 - vy1 * t1, 0),
        sym.Eq(zk + t1 * vzk - z1 - vz1 * t1, 0),
        sym.Eq(xk + t2 * vxk - x2 - vx2 * t2, 0),
        sym.Eq(yk + t2 * vyk - y2 - vy2 * t2, 0),
        sym.Eq(zk + t2 * vzk - z2 - vz2 * t2, 0),
        sym.Eq(xk + t3 * vxk - x3 - vx3 * t3, 0),
        sym.Eq(yk + t3 * vyk - y3 - vy3 * t3, 0),
        sym.Eq(zk + t3 * vzk - z3 - vz3 * t3, 0),
    ],
    (xk, yk, zk, vxk, vyk, vzk, t1, t2, t3),
    dict=True,
)

assert result == [
    {
        t1: 154588043705,
        t2: 499903573610,
        t3: 548282595621,
        vxk: 214,
        vyk: -168,
        vzk: 249,
        xk: 172543224455736,
        yk: 348373777394510,
        zk: 148125938782131,
    }
]

print(f'\nResult:\n{result}')