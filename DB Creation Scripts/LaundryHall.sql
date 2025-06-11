SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LaundryHall]
(
    [UID] [int] NOT NULL,
    [HallID] [int] IDENTITY(1,1) NOT NULL,
    [HALLNAME] [varchar](50) NOT NULL,
    [Address] [varchar](100) NOT NULL,
    [GPSLT] [decimal](9, 6) NOT NULL,
    [GPSLG] [decimal](9, 6) NOT NULL,
    [WaitingTime] [int] NOT NULL,
    [isDeleted] [int] NOT NULL,
    [isDeletedDate] [date] NULL,
    [otherInfo] [varchar](255) NULL,
    PRIMARY KEY CLUSTERED 
(
	[HallID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[LaundryHall] ADD  DEFAULT ((0)) FOR [isDeleted]
GO
ALTER TABLE [dbo].[LaundryHall]  WITH CHECK ADD FOREIGN KEY([UID])
REFERENCES [dbo].[University] ([UID])
GO
