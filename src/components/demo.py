def ks(n,wt,val,pro):
    if(wt==0):
        print("en")
        return 0
    if(n==0 ):
        if(val[n]<=wt):
            return  pro[0]
        else:
            return 0
    
    np=ks(n-1,wt,val,pro)
    p=0
    if(val[n]<=wt):
        p=pro[n]+ks(n-1,wt-val[n],val,pro)
    return max(p,np)

def ks_memo(n,wt,val,pro,dp):
    # if(wt==0):
    #     return 0
    if(n==0 ):
        if(val[n]<=wt):
            return  pro[0]
        else:
            return 0
    if(dp[n][wt]!=-1):
        return dp[n][wt]
    
    np=ks_memo(n-1,wt,val,pro,dp)
    p=0
    if(val[n]<=wt):
        p=pro[n]+ks_memo(n-1,wt-val[n],val,pro,dp)
    dp[n][wt]=max(p,np)
    return dp[n][wt]
def ks_so(n,wt,val,pro):
    prev=[0 for i in range(wt+1)]
    for i in range(val[0],wt+1):
        prev[i]=pro[0]

            
  
    for i in range(1,n+1):
        for j in range(wt,-1,-1):

            np=prev[j]
            p=0
            if(val[i]<=j):
                p=pro[i]+prev[j-val[i]]
            prev[j]=max(p,np)
    print(prev)
    return prev[wt]
def ks_tab(n,wt,val,pro,dp):
  
    for i in range(val[0],wt):
        dp[0][i]=pro[0]

    # for j in range(wt):
    #     dp[0][j]=
            
  
    for i in range(1,n+1):
        for j in range(wt+1):

            np=dp[i-1][j]
            p=0
            if(val[i]<=j):
                p=pro[i]+dp[i-1][j-val[i]]
            dp[i][j]=max(p,np)
   
    return dp[n][wt]

n=3
wt=6
val=[3,4,6]
pro=[30,50,60]
# arr=[2]
dp=[[-1 for i in range(wt+1)] for j in range(n)]
dp2=[[0 for i in range(wt+1)] for j in range(n)]
# print(dp)
print(ks(n-1,wt,val,pro))
print(ks_memo(n-1,wt,val,pro,dp))
print(ks_tab(n-1,wt,val,pro,dp2))
print(dp2)
print(ks_so(n-1,wt,val,pro))


