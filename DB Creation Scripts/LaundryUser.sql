SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LaundryUser]
(
    [UserID] [int] IDENTITY(1,1) NOT NULL,
    [Username] [varchar](25) NOT NULL,
    [Password] [varchar](25) NOT NULL,
    [firstname] [varchar](25) NULL,
    [lastname] [varchar](25) NULL,
    [address] [varchar](100) NULL,
    [accountType] [varchar](20) NULL,
    [UserDegree] [varchar](20) NULL,
    [isDeleted] [int] NULL,
    [cellNo] [varchar](20) NULL,
    [IMEI] [varchar](20) NULL,
    [cnic] [varchar](20) NULL,
    [email] [varchar](50) NULL,
    [otherInfo] [varchar](255) NULL,
    PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
