// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <=0.9.0;
contract Upload{
    struct  Access{
        address user;
        bool access;//true or false value
    }
    mapping(address=>string[]) value;
    mapping(address=>mapping(address=>bool)) ownership;
    mapping(address=>Access[]) accessList;
    mapping(address=>mapping(address=>bool)) prevData;

    function Add(address _user,string memory imgUrl) external{
        value[_user].push(imgUrl);
    }
    function Allow(address _user) external {
        ownership[msg.sender][_user]=true;
        if(prevData[msg.sender][_user]==true){
            for(uint i=0;i<accessList[msg.sender].length;i++){
                if(accessList[msg.sender][i].user==_user){
                    accessList[msg.sender][i].access=true;
                }
            }
        }
        else{
            accessList[msg.sender].push(Access(_user,true));
            prevData[msg.sender][_user]=true;
        }
    }
    function Disallow(address _user) public{
        ownership[msg.sender][_user]=false;
        for(uint i=0;i<accessList[msg.sender].length;i++){
            if(accessList[msg.sender][i].user==_user){
                accessList[msg.sender][i].access=false;//we are not removing data just making false but if we push again while  allow,
                //two data with diff access will be created..thus prevdata is needed.
            }
        }
    }
    function Display(address _user) external view returns (string[] memory){
        require(_user==msg.sender || ownership[msg.sender][_user],"You Don't Have The Access");
        return value[msg.sender];
    }
    function ShareAccess() external view returns (Access[] memory){
        return accessList[msg.sender];
    }
}