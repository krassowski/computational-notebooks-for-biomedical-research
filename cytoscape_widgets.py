def change_spacing(network):
    def on_change(change):
        if change['name'] != 'value':
            return
        network.set_layout(nodeSpacing=change['new'])
    return on_change


def set_layout(network):
    def callback(event):
        if event['name'] != 'value':
            return
        new_layout = event['new']
        network.set_layout(name=new_layout)
    return callback