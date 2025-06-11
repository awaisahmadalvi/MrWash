SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[University]
(
    [UID] [int] IDENTITY(1,1) NOT NULL,
    [University] [varchar](20) NULL,
    [isDeleted] [int] NOT NULL,
    [isDeletedDate] [date] NULL,
    [otherInfo] [varchar](255) NULL,
    [UniAddress] [varchar](255) NULL,
    PRIMARY KEY CLUSTERED 
(
	[UID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[University] ADD  DEFAULT ((0)) FOR [isDeleted]
GO
