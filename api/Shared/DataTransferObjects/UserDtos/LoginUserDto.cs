﻿namespace Shared.DataTransferObjects.UserDtos;

public class LoginUserDto : UserDto
{
    public string Password { get; set; } = string.Empty;
    
}