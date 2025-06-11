SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LaundryMachines]
(
    [MachineID] [int] IDENTITY(1,1) NOT NULL,
    [HallID] [int] NOT NULL,
    [MachineType] [varchar](255) NULL,
    [Description] [varchar](255) NULL,
    [Rate] [decimal](10, 2) NULL,
    [MachineCycleTime] [int] NULL,
    [MachineStatus] [varchar](25) NULL,
    [InstallDate] [date] NULL,
    [isDeleted] [int] NOT NULL,
    [isDeletedDate] [date] NULL,
    [otherInfo] [varchar](255) NULL,
    [MacAddress] [varchar](255) NULL,
    [Res_TranID] [int] NULL,
    [IsTurnOn] [int] NULL,
    CONSTRAINT [pk_LaundryMachines] PRIMARY KEY CLUSTERED 
(
	[MachineID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[LaundryMachines] ADD  DEFAULT ((0)) FOR [isDeleted]
GO
ALTER TABLE [dbo].[LaundryMachines] ADD  DEFAULT ((0)) FOR [IsTurnOn]
GO
ALTER TABLE [dbo].[LaundryMachines]  WITH CHECK ADD FOREIGN KEY([HallID])
REFERENCES [dbo].[LaundryHall] ([HallID])
GO
