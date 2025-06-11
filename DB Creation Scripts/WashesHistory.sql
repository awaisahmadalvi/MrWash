SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WashesHistory]
(
    [WHID] [int] IDENTITY(1,1) NOT NULL,
    [SLID] [int] NOT NULL,
    [MachineId] [int] NOT NULL,
    [UserId] [int] NOT NULL,
    [StartTime] [datetime] NULL,
    [WashStartTime] [datetime] NULL,
    [WashEndTime] [datetime] NULL,
    [Description] [varchar](255) NULL,
    [WashStatus] [int] NULL,
    [isDeleted] [int] NOT NULL,
    [isDeletedDate] [date] NULL,
    [otherInfo] [varchar](255) NULL,
    PRIMARY KEY CLUSTERED 
(
	[WHID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[WashesHistory] ADD  CONSTRAINT [DF_WashesHistory_isDeleted]  DEFAULT ((0)) FOR [isDeleted]
GO
ALTER TABLE [dbo].[WashesHistory]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[LaundryUser] ([UserID])
GO
ALTER TABLE [dbo].[WashesHistory]  WITH CHECK ADD FOREIGN KEY([SLID])
REFERENCES [dbo].[StudentLedger] ([SLID])
GO
ALTER TABLE [dbo].[WashesHistory]  WITH CHECK ADD  CONSTRAINT [WashesHistory_Machine_ID_FK] FOREIGN KEY([MachineId])
REFERENCES [dbo].[LaundryMachines] ([MachineID])
GO
ALTER TABLE [dbo].[WashesHistory] CHECK CONSTRAINT [WashesHistory_Machine_ID_FK]
GO
