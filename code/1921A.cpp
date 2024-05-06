// TSETEN RGIPT
// SOMEDAY
#include <bits/stdc++.h>
#define ll long long int
using namespace std;

#define ll long long int
#define br << endl
#define rep(i, n) for (ll i = 0; i < n; i++)
#define repi(i, n) for (ll i = 1; i <= n; i++)
#define repii(i, n) for (ll i = 1; i < n; i++)
#define gcd __gcd
const ll MOD = 998244353;

// question padh le bhai
// constraits bhi dekh lo plz..
// have trust on urself, jo tu kar rha hai best approach hai.
// pratistha ke chakkar me gaand mat do
// sir jo dimag me test case aa raha hai uspe chala ke dekh lo ek bar

// Function to calculate the greatest common divisor
ll gcd(ll a, ll b)
{
    return (b == 0) ? a : gcd(b, a % b);
}

ll lcm(ll a, ll b)
{
    return a * (b / gcd(a, b));
}

// Code Begins Here

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);

    ll _;
    cin >> _;
    while (_--)
    {
        ll x[4], y[4];
        for (ll i = 0; i < 4; ++i)
        {
            cin >> x[i] >> y[i];
        }

        sort(x, x + 4);
        sort(y, y + 4);

        ll side = max(x[3] - x[0], y[3] - y[0]);
        ll area = side * side;

        cout << area br;
    }
    return 0;
}