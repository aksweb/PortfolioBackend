// TSETEN RGIPT
// ΣDAY
#include <bits/stdc++.h>
#define ll long long int
using namespace std;

#define ll long long int
#define br << endl
#define rep(i, n) for (ll i = 0; i < n; i++)
#define repi(i, n) for (ll i = 1; i <= n; i++)
#define repii(i, n) for (ll i = 1; i < n; i++)
#define gcd __gcd
const ll MOD = 1e9 + 7;

// question padh le bhai
// constraits bhi dekh lo plz..
// isse achha approach nahi melega.
// sir jo dimag me test case aa raha hai uspe chala ke dekh lo ek bar

// Ye kab tk likhoge
ll gcd(ll a, ll b)
{
    return (b == 0) ? a : gcd(b, a % b);
}
ll lcm(ll a, ll b)
{
    return a * (b / gcd(a, b));
}

// Code Begins Here
bool cmp(const pair<ll, ll> a, const pair<ll, ll> b)
{
    if (a.first == b.first)
        return a.second < b.second;
    else
        return a.first > b.first;
}
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    ll _;
    cin >> _;
    while (_--)
    {
        ll n, k;
        cin >> n >> k;
        ll a[n];
        vector<pair<ll, ll>> mkp;
        rep(i, n)
        {
            cin >> a[i];
            a[i] %= k;
            if (a[i] == 0)
                cout << i + 1 << " ";
            else
                mkp.push_back({a[i], i + 1});
        }
        sort(mkp.begin(), mkp.end(), cmp);
        for (auto it : mkp)
        {
            cout << it.second << " ";
        }
        cout << "\n";
    }

    return 0;
}